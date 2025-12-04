import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CatalogService } from '../catalog.service';

@Controller()
export class CatalogEventsController {
  constructor(private readonly catalogService: CatalogService) { }

  // O padrão do evento deve ser IDÊNTICO ao enviado pelo Session Service
  @EventPattern('session.seat.reserved')
  async handleSeatReserved(@Payload() data: any) {
    console.log('Event received in Catalog Service:', data);

    const { sessionId, seatId } = data;

    await this.catalogService.updateSeatAvailability(sessionId, seatId, false);
  }
}