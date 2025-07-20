
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PaymentsGateway {
  @WebSocketServer()
  server: Server;

  emitPaymentUpdate(payment: any) {
    this.server.emit('paymentUpdate', payment);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data: string): void {
    console.log('Client joined room:', data);
  }
}