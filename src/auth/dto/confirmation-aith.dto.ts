import { IsNumber, IsString } from 'class-validator';

export class ConfirmationAuthDto {
  @IsString()
  confirmation: string;
  @IsNumber()
  userId: number;
}
