import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CatalogController } from './catalog/catalog.controller';
import { CatalogService } from './catalog/catalog.service';
import { PrismaService } from './prisma/prisma.service';
import { SessionIntegrationService } from './integration/session-integration.service';
import { TicketIntegrationService } from './integration/ticket-integration.service';

@Module({
  imports: [
    // Módulo HTTP necessário para as integrações de borda
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [CatalogController],
  providers: [
    PrismaService,
    CatalogService,
    // Interfaces de Borda registradas como Providers
    SessionIntegrationService,
    TicketIntegrationService,
  ],
})
export class AppModule { }