import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConfirmationAuthDto } from './dto/confirmation-aith.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  login(@Body() dto: CreateAuthDto) {
    return this.authService.login(dto);
  }
  @Post('register')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  register(@Body() dto: CreateAuthDto) {
    return this.authService.register(dto);
  }

  @Post('confirmation')
  @HttpCode(200)
  confirmation(@Body() dto: ConfirmationAuthDto) {
    return this.authService.confirmation(dto);
  }

  @Post('forgot')
  @HttpCode(200)
  forgotPassword() {}
}
