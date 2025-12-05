import { Body, Controller, Post } from '@nestjs/common';
import { SessionService } from './session.service';
import { ReserveSeatDto } from './dto/reserve-seat.dto';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  @Post('reserve')
  async reserve(@Body() reserveSeatDto: ReserveSeatDto) {
    return this.sessionService.reserveSeat(reserveSeatDto);
  }
}