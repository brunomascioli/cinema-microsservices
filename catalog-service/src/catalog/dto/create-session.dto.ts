import { IsString, IsISO8601, IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  movieId: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsISO8601()
  startTime: string; // ISO Date String
}