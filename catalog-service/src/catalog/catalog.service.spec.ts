import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { PrismaService } from '../prisma/prisma.service';
describe('CatalogService', () => {
  let service: CatalogService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalogService, PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    service = module.get<CatalogService>(CatalogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
