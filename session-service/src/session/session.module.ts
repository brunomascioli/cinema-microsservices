import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CATALOG_BUS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'cinema_sync_queue', // Fila do Catálogo
          queueOptions: { durable: false },
        },
      },
      {
        name: 'TICKET_BUS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'ticket_creation_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule { }