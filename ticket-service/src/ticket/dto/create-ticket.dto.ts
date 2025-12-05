import { IsUUID, IsNumber, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsUUID()
  ticketId: string;

  @IsUUID()
  sessionId: string;

  @IsUUID()
  seatId: string;

  @IsUUID()
  userId: string;

  @IsNumber()
  price: number;
}