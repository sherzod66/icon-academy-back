import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma service/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { MailerService } from '@nestjs-modules/mailer';
import { mailerForm } from './mailerForm/mailer-form';
import { ConfirmationAuthDto } from './dto/confirmation-aith.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}
  async auth(createAuthDto: CreateAuthDto) {
    const findUser = await this.prisma.users.findUnique({
      where: { email: createAuthDto.email },
    });
    if (findUser) {
      const verifyPassword = await verify(
        findUser.password,
        createAuthDto.password,
      );
      if (!verifyPassword)
        throw new BadRequestException('A user with such email exists!');

      const randomKey = this.randomKey();
      const hashRandom = await hash(`${randomKey}`);

      await this.prisma.users.update({
        where: { id: findUser.id },
        data: {
          activationKey: hashRandom,
        },
      });
      await this.activationMail(createAuthDto.email, randomKey);
      return {
        message: 'Activate code sent!',
        id: findUser.id,
      };
    } else {
      const randomKey = this.randomKey();
      const hashRandom = await hash(`${randomKey}`);
      const pass = await hash(createAuthDto.password);
      const createUser = await this.prisma.users.create({
        data: {
          activationKey: hashRandom,
          email: createAuthDto.email,
          password: pass,
        },
      });
      await this.activationMail(createAuthDto.email, randomKey);
      return {
        message: 'Activate code sent!',
        id: createUser.id,
      };
    }
  }

  async confirmation(dto: ConfirmationAuthDto) {
    const find = await this.prisma.users.findUnique({
      where: { id: dto.userId },
    });
    if (!find) throw new BadRequestException('Invalid confirmation number!');
    const verifyConfirmation = await verify(
      find.activationKey,
      dto.confirmation,
    );
    if (!verifyConfirmation)
      throw new BadRequestException('Invalid confirmation number!');

    return {
      ...find,
      token: await this.generateToken(find.id, find.email),
    };
  }

  async findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  async remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  randomKey(): number {
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const milliseconds = new Date().getMilliseconds();
    const key = `${hours}${minutes}${milliseconds}`;
    const generateNum = Math.round(Math.random() * +key);
    return generateNum;
  }
  async generateToken(userId: number, email: string) {
    const payload = { id: userId, email };
    return await this.jwtService.signAsync(payload, { expiresIn: '30d' });
  }

  async activationMail(to: string, key: number) {
    await this.mailService.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Your verification key is on ${process.env.CLIENT_URL}`,
      text: `activate key: ${key}`,
      html: mailerForm(key),
    });
  }
}
