import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './payment.schema';
import { PaymentsGateway } from './payments.gateway';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentFilterDto } from './dto/payment-filter.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private paymentsGateway: PaymentsGateway,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const createdPayment = new this.paymentModel(createPaymentDto);
    const saved = await createdPayment.save();

    // Emit real-time update
    this.paymentsGateway.emitPaymentUpdate(saved);

    return saved;
  }

  async findAll(filterDto: PaymentFilterDto) {
    const {
      page = 1,
      limit = 10,
      status,
      method,
      startDate,
      endDate,
    } = filterDto;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) filter.status = status;
    if (method) filter.method = method;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const payments = await this.paymentModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .exec();

    const total = await this.paymentModel.countDocuments(filter);

    return {
      data: payments,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    return this.paymentModel.findById(id).exec();
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const [
      totalPaymentsToday,
      totalPaymentsWeek,
      totalRevenue,
      failedTransactions,
      revenueByDay,
    ] = await Promise.all([
      this.paymentModel.countDocuments({
        createdAt: { $gte: today },
        status: 'success',
      }),
      this.paymentModel.countDocuments({
        createdAt: { $gte: thisWeek },
        status: 'success',
      }),
      this.paymentModel.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      this.paymentModel.countDocuments({ status: 'failed' }),
      this.paymentModel.aggregate([
        {
          $match: {
            createdAt: { $gte: thisWeek },
            status: 'success',
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return {
      totalPaymentsToday,
      totalPaymentsWeek,
      totalRevenue: totalRevenue[0]?.total || 0,
      failedTransactions,
      revenueByDay,
    };
  }
}
