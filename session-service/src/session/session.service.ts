import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @Inject('EVENT_BUS') private client: ClientProxy, // Injeta a conexão configurada no Module
  ) { }

  async reserveSeat(sessionId: string, seatId: string, userId: string) {

    // --- ETAPA 1: WRITE (O comando) ---
    // Aqui entra o teu código de banco de dados (Prisma/TypeORM)
    // Valida se o assento já não está ocupado na tabela 'Session'
    // Ex: const session = await prisma.session.update(...)

    // Simulando a gravação no banco:
    this.logger.log(`[WRITE] Assento ${seatId} gravado como OCUPADO no banco Session DB.`);

    // --- ETAPA 2: EVENT (A sincronização) ---
    // Prepara o pacote de dados para enviar
    const eventPayload = {
      sessionId,
      seatId,
      status: 'OCCUPIED',
      timestamp: new Date(),
      triggeredBy: userId
    };

    // Envia para a fila. 
    // IMPORTANTE: O texto 'session.seat.reserved' tem de ser IGUAL ao @EventPattern do Catalog
    this.client.emit('session.seat.reserved', eventPayload);

    this.logger.log(`[EVENT] Mensagem enviada para o RabbitMQ: session.seat.reserved`);

    return {
      success: true,
      message: 'Reserva processada com sucesso'
    };
  }
}