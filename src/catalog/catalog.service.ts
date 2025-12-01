import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionIntegrationService } from '../integration/session-integration.service';
import { TicketIntegrationService } from '../integration/ticket-integration.service';

@Injectable()
export class CatalogService {
  constructor(
    private readonly prisma: PrismaService,
    // Injeção dos serviços de integração conforme Diagrama C4 Component
    private readonly sessionIntegration: SessionIntegrationService,
    private readonly ticketIntegration: TicketIntegrationService,
  ) { }

  async findAllMovies() {
    return this.prisma.movie.findMany();
  }

  async createSession(data: CreateSessionDto) {
    // 1. Validação local (se o filme e sala existem)
    const room = await this.prisma.room.findUnique({ where: { id: data.roomId } });
    if (!room) throw new NotFoundException('Sala não encontrada');

    // 2. Persistência no DB local do Catálogo (Postgres/Prisma)
    const session = await this.prisma.session.create({
      data: {
        movieId: data.movieId,
        roomId: data.roomId,
        startTime: new Date(data.startTime),
      },
      include: {
        movie: true,
        room: true
      }
    });

    // 3. Orquestração / Comunicação Assíncrona (via HTTP/REST neste exemplo)
    // Avisa o microsserviço de Sessão para preparar o mapa de assentos para vendas
    // O diagrama marca isso como "Async", idealmente seria via Message Broker (RabbitMQ/Kafka),
    // mas aqui implementamos a interface conforme pedido no código TS.
    await this.sessionIntegration.initializeSessionState(
      session.id,
      room.id,
      room.capacity
    );

    return session;
  }

  async getSessionsForMovie(movieId: string) {
    return this.prisma.session.findMany({
      where: { movieId },
      include: { room: true },
    });
  }
}