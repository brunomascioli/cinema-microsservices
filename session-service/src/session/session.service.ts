import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid'; // Instale: npm install uuid @types/uuid

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @Inject('CATALOG_BUS') private catalogClient: ClientProxy,
    @Inject('TICKET_BUS') private ticketClient: ClientProxy,
  ) { }

  async processPurchase(sessionId: string, seatId: string, userId: string) {

    // --- 1. RESERVA (Local Session DB) ---
    // Verifica disponibilidade e "Locka" o assento
    // const reservation = await this.sessionRepo.create(...)
    this.logger.log(`1. [RESERVE] Assento ${seatId} bloqueado temporariamente (10 min).`);

    // --- 2. SINCRONIZA CATÁLOGO (Evento) ---
    this.catalogClient.emit('seat.reserved', { sessionId, seatId });
    this.logger.log(`2. [SYNC] Enviado aviso ao Catálogo.`);

    // --- 3. PAGAMENTO (Simulação) ---
    // Aqui tu chamarias o PaymentService futuramente.
    const paymentSuccess = await this.mockPaymentProcessing();

    if (!paymentSuccess) {
      // Se falhar, terias de emitir evento de compensação para liberar o assento
      throw new Error("Pagamento falhou");
    }
    this.logger.log(`3. [PAYMENT] Pagamento confirmado (Simulado).`);

    // --- 4. GERAÇÃO DO TICKET ---
    const ticketData = {
      id: uuidv4(),
      sessionId,
      seatId,
      userId,
      qrCode: `QR_${sessionId}_${seatId}`, // Simulação
      status: 'VALID',
      createdAt: new Date()
    };

    // --- 5. PERSISTÊNCIA DO TICKET (Evento para TicketService) ---
    // O SessionService não grava na tabela de tickets diretamente. Ele pede ao TicketService.
    this.ticketClient.emit('ticket.issue', ticketData);
    this.logger.log(`4. [TICKET] Solicitação de persistência enviada para TicketService.`);

    // --- 6. RETORNO AO FRONTEND ---
    // Retorna os dados do ingresso imediatamente
    return {
      success: true,
      message: "Compra realizada com sucesso!",
      ticket: ticketData
    };
  }

  // Simula um delay de processamento de pagamento
  private async mockPaymentProcessing(): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 1000));
  }
}