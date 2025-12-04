import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { CatalogEventsController } from './catalog-events/catalog-events.controller';

@Module({
  controllers: [CatalogController, CatalogEventsController],
  providers: [CatalogService],
})
export class CatalogModule { }
