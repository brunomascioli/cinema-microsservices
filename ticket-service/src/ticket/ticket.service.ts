import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Ajuste o caminho conforme sua estrutura
import { CreateTicketDto } from './dto/create-ticket.dto'; // Importe seu DTO

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async createTicket(data: CreateTicketDto) {
  
    return await this.prisma.ticket.create({
      data: {
        id: data.ticketId, 
        sessionId: data.sessionId,
        seatId: data.seatId,
        userId: data.userId,
        price: data.price,
        status: 'VALID',
      },
    });
  }
}