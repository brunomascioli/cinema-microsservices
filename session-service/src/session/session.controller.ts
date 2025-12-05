import { Body, Controller, Post } from '@nestjs/common';
import { SessionService } from './session.service';

class ReserveSeatDto {
  sessionId: string;
  seatId: string;
  userId: string;
}

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  @Post('reserve')
  async reserve(@Body() body: ReserveSeatDto) {
    return this.sessionService.reserveSeat(
      body.sessionId,
      body.seatId,
      body.userId
    );
  }
}