import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayConnection,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { RequestService } from './request.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UpdateNotificationDto } from './dto/update-request.dto';
import { TSelectUser } from './entities/userSelect';
import { StatisticDto } from './dto/statistic.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class RequestGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly requestService: RequestService,
    private readonly jwtService: JwtService,
  ) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('new-notification')
  async newNotification(
    @MessageBody() dto: CreateNotificationDto,
    @ConnectedSocket() client: Socket,
  ) {
    const create = await this.requestService.createNotification(dto);
    if (!create.success)
      return { error: -1, message: 'Error creating request' };
    const getNotification = await this.requestService.findAll();
    client.emit('new-notification-response', create);
    this.server.emit('get-notifications', getNotification);
  }

  @SubscribeMessage('update-notification')
  async updateNotification(
    @MessageBody() dto: UpdateNotificationDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = await this.checkUser(client);
    const update = await this.requestService.update(dto);
    if (!update.success) return { error: -1, message: 'Error during update' };
    const getNotification = await this.requestService.findAll();
    this.server.emit('get-notifications', getNotification);
  }

  @SubscribeMessage('notifications')
  async notifications(@ConnectedSocket() client: Socket) {
    const userId = await this.checkUser(client);
    const getNotification = await this.requestService.findAll();
    client.emit('get-notifications', getNotification);
  }

  @SubscribeMessage('visitors')
  async visitors(
    @MessageBody() dto: StatisticDto,
    @ConnectedSocket() client: Socket,
  ) {
    const st = await this.requestService.statistic(dto);
    client.emit('visitor', st);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log('CONNECT');
    const user = await this.checkIsAdmin(client);
    if (user) {
      client.emit('is-admin', user);
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('DISCONNECT');
  }

  async checkUser(client: Socket): Promise<number | undefined> {
    try {
      const decoded = await this.jwtService.verifyAsync(
        client.handshake.auth.token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      const user = await this.requestService.findOne(decoded.id);
      !user && client.disconnect(true);
      !user.isAdmin && client.disconnect(true);

      return decoded.id;
    } catch (e) {
      client.emit('jwt-expired', true);
      client.disconnect(true);
      return undefined;
    }
  }

  async checkIsAdmin(client: Socket): Promise<TSelectUser | undefined> {
    try {
      const decoded = await this.jwtService.verifyAsync(
        client.handshake.auth.token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      const user = await this.requestService.findOne(decoded.id);
      if (user) return user;
      else return undefined;
    } catch (e) {
      //client.emit('jwt-expired', true);
      return undefined;
    }
  }
}
