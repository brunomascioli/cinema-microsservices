import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

/**
 * Interface de Borda para o Microsserviço de Tickets.
 * * Responsabilidade: Solicitar a geração de tickets ou validar regras de emissão
 * que dependam de dados do catálogo.
 */
@Injectable()
export class TicketIntegrationService {
  private readonly logger = new Logger(TicketIntegrationService.name);
  private readonly ticketServiceUrl = 'http://ticket-service:3000';

  constructor(private readonly httpService: HttpService) { }

  /**
   * Exemplo: O Catálogo pode precisar avisar o Ticket Service sobre 
   * regras de precificação baseadas no filme (pré-estreia, 3D, etc).
   */
  async registerPricingRule(movieId: string, basePrice: number): Promise<void> {
    this.logger.log(`Enviando regra de preço para filme ${movieId} ao TicketService`);

    try {
      await firstValueFrom(
        this.httpService.post(`${this.ticketServiceUrl}/internal/pricing-rules`, {
          movieId,
          basePrice
        })
      );
    } catch (error) {
      this.logger.error(`Erro ao integrar com TicketService: ${error.message}`);
    }
  }
}