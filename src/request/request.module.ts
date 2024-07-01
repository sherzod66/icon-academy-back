import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestGateway } from './request.gateway';
import { PrismaService } from 'src/prisma service/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [RequestGateway, RequestService, PrismaService, JwtService],
})
export class RequestModule {}
