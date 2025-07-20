import { IsNumber, IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  receiver: string;

  @IsEnum(['success', 'failed', 'pending'])
  status: string;

  @IsEnum(['credit_card', 'debit_card', 'paypal', 'bank_transfer'])
  method: string;
}