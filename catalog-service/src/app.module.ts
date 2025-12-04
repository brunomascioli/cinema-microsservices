import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CatalogController } from './catalog/catalog.controller';
import { CatalogService } from './catalog/catalog.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
})
export class AppModule { }