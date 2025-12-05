import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TicketService } from './ticket.service'; // Importe o service

@Controller()
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @EventPattern('ticket.issue')
  async handleTicketIssue(@Payload() data: any) {
    console.log('🎟️ [TicketService] Recebido pedido de emissão:', data);

    await this.ticketService.createTicket(data);

    console.log('✅ [TicketService] Ticket persistido no banco com sucesso!');
  }
}