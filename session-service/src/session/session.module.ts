import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_BUS', // Nome que usaremos para injetar no Service
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'], // Verifica se é esta a URL do teu Docker
          queue: 'cinema_sync_queue', // <--- CONFIRMA SE ESTÁ IGUAL AO CATALOG-SERVICE
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule { }