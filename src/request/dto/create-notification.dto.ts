import { IsEmail, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  phoneNumber: string;
  @IsString()
  fullName: string;
  @IsEmail()
  email: string;
}
