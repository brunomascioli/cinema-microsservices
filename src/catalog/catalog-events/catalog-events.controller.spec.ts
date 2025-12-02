import { Test, TestingModule } from '@nestjs/testing';
import { CatalogEventsController } from './catalog-events.controller';

describe('CatalogEventsController', () => {
  let controller: CatalogEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogEventsController],
    }).compile();

    controller = module.get<CatalogEventsController>(CatalogEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
