import { Body, Controller, Post } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  @Post('buy')
  async buyTicket(@Body() body: any) {
    return this.sessionService.processPurchase(
      body.sessionId,
      body.seatId,
      body.userId
    );
  }
}