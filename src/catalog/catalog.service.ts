import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionIntegrationService } from '../integration/session-integration.service';
import { TicketIntegrationService } from '../integration/ticket-integration.service';
import { PrismaClient } from '@prisma/client/extension';

@Injectable()
export class CatalogService {
  private readonly prisma: PrismaClient;
  constructor(
    private readonly prismaService: PrismaService,
    // Injeção dos serviços de integração conforme Diagrama C4 Component
    // private readonly sessionIntegration: SessionIntegrationService,
    // private readonly ticketIntegration: TicketIntegrationService,
  ) {
    this.prisma = this.prismaService.prisma;
  }

  async findAllMovies() {
    return this.prisma.movie.findMany();
  }

  async getSessionsForMovie(movieId: string) {
    return this.prisma.session.findMany({
      where: { movieId },
      include: { room: true },
    });
  }

  async getSessionDetails(sessionId: string) { }
  async getAllSessions() { }
}