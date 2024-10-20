import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma service/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-request.dto';
import { UserSelect } from './entities/userSelect';
import { StatisticDto } from './dto/statistic.dto';

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) {}
  async createNotification(dto: CreateNotificationDto) {
    const create = await this.prisma.notifications.create({
      data: {
        createdAt: String(Date.now()),
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
        email: dto.email,
        ref: dto.ref,
      },
    });
    return { success: true };
  }

  async findAll() {
    const findAll = await this.prisma.notifications.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return findAll;
  }

  async update({ notificationId }: UpdateNotificationDto) {
    const find = await this.prisma.notifications.findUnique({
      where: { id: notificationId },
    });
    if (!find) return { success: false };
    await this.prisma.notifications.update({
      where: { id: notificationId },
      data: {
        made: !find.made,
      },
    });
    return { success: true };
  }
  async findOne(id: number) {
    return await this.prisma.users.findUnique({
      where: { id },
      select: UserSelect,
    });
  }

  async statistic(dto: StatisticDto) {
    const findDay = await this.prisma.visitors.findUnique({
      where: { id: dto.date },
      include: { referer: true },
    });
    if (findDay) {
      await this.prisma.visitors.update({
        where: { id: dto.date },
        data: {
          views: { increment: 1 },
          referer: { create: { referer: dto.referer } },
        },
      });
    } else {
      await this.prisma.visitors.create({
        data: {
          id: dto.date,
          views: 1,
          referer: { create: { referer: dto.referer } },
        },
      });
    }
    return { success: true };
  }

  async getStatistics() {
    const statistics = await this.prisma.visitors.findMany({
      include: { referer: true },
    });
    return statistics;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
