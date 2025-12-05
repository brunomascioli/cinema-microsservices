import {
  Inject,
  Injectable,
  Logger,
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { ReserveSeatDto } from './dto/reserve-seat.dto';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    // Injetamos o RabbitMQ (Event Bus)
    @Inject('EVENT_BUS') private client: ClientProxy,
    // Injetamos o Banco de Dados
    private prisma: PrismaService,
  ) { }

  async reserveSeat(dto: ReserveSeatDto) {
    const { sessionId, seatId, userId } = dto;
    this.logger.log(`🔒 [Processing] Tentando reservar assento ${seatId} para a sessão ${sessionId}...`);

    try {
      // --- 1. PERSISTÊNCIA (Atomic Database Lock) ---
      // Tenta criar o registro. Graças ao @@unique([sessionId, seatId]) no Schema,
      // o banco rejeitará fisicamente qualquer tentativa de duplicidade.
      const reservation = await this.prisma.prisma.seatReservation.create({
        data: {
          sessionId,
          seatId,
          userId,
          status: 'LOCKED', // Começa como travado
          // Define expiração para daqui a 15 minutos (Regra de Negócio)
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      this.logger.log(`✅ [Database] Assento travado com sucesso! ID Reserva: ${reservation.id}`);

      // --- 2. EVENT SOURCING (Sincronização) ---
      // Se chegamos aqui, o lugar é nosso. Agora avisamos o Catálogo.
      const eventPayload = {
        sessionId,
        seatId,
        status: 'OCCUPIED', // O Catálogo entende LOCKED como Ocupado
        timestamp: new Date(),
        reservationId: reservation.id
      };

      // Importante: O nome 'session.seat.reserved' deve ser igual ao @EventPattern do CatalogService
      this.client.emit('session.seat.reserved', eventPayload);

      this.logger.log(`📡 [EventBus] Evento 'session.seat.reserved' disparado.`);

      return {
        success: true,
        message: 'Assento reservado temporariamente. Realize o pagamento.',
        data: {
          reservationId: reservation.id,
          expiresAt: reservation.expiresAt
        }
      };

    } catch (error) {
      // --- 3. TRATAMENTO DE ERROS ---

      // P2002 é o código oficial do Prisma para "Unique constraint failed"
      if (error.code === 'P2002') {
        this.logger.warn(`❌ [Conflict] O assento ${seatId} JÁ foi reservado por outra pessoa.`);
        throw new ConflictException('Desculpe, este assento acabou de ser ocupado.');
      }

      this.logger.error('Erro crítico ao reservar:', error);
      throw new InternalServerErrorException('Erro ao processar sua reserva.');
    }
  }
}