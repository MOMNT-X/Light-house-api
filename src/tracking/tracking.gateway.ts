import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  path: '/tracking',
  cors: {
    origin: '*', // Set strict origin in prod
  },
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) throw new Error('No token');
      
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      
      client.data.user = payload; // Store user data in socket segment
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Cleanup if needed
  }

  @SubscribeMessage('join:order')
  handleJoinOrder(
    @MessageBody() data: { orderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.sub;
    const room = `order_${data.orderId}`;
    client.join(room);
    return { event: 'joined', data: room };
  }

  // Method to be called by OrdersService or Webhooks internally
  emitOrderStatusUpdate(orderId: string, status: string) {
    this.server.to(`order_${orderId}`).emit('order:status', {
      orderId,
      status,
      updatedAt: new Date().toISOString(),
    });
  }
}
