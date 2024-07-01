import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RequestModule } from './request/request.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, RequestModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
