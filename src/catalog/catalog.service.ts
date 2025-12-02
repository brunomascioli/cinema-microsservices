import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async findAllMovies() {
    return this.prismaService.prisma.movie.findMany();
  }

  async getSessionsForMovie(movieId: string) {
    return this.prismaService.prisma.session.findMany({
      where: { movieId },
      include: { room: true },
    });
  }

  async getSessionDetails(sessionId: string) {
    return this.prismaService.prisma.session.findUnique({
      where: { id: sessionId },
      include: { room: { include: { seats: true } }, },
    });
  }
  async getAllSessions() {
    return this.prismaService.prisma.session.findMany({
      include: { room: true },
    });
  }

  async updateSeatAvailability(sessionId: string, seatId: string, isAvailable: boolean) {
    await this.prismaService.prisma.session.update({
      where: { id: sessionId },
      data: {
        seatsStatus: {
          update: {
            where: { id: seatId },
            data: { isAvailable: isAvailable }
          }
        }
      }
    });
    console.log(`[SYNC] Catalog updated: Seat ${seatId} is now ${isAvailable ? 'Available' : 'Occupied'}`);
  }
}