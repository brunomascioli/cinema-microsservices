import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_BUS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'cinema_sync_queue', // Deve bater com o CatalogService
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [SessionController],
  providers: [SessionService, PrismaService], // <--- PrismaService aqui
})
export class SessionModule { }