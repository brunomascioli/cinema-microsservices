import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class TicketController {

  @EventPattern('ticket.issue') // O evento que o SessionService vai disparar
  handleTicketIssue(@Payload() data: any) {
    console.log('🎟️ [TicketService] Recebido pedido de emissão:', data);

    // AQUI TU IMPLEMENTARIAS O SAVE NO BANCO DO TICKET
    // await this.ticketRepository.save(data);

    console.log('✅ [TicketService] Ticket persistido no banco com sucesso!');
  }
}