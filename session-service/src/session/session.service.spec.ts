import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { PrismaService } from '../prisma/prisma.service'; // Ajuste o caminho se necessário

describe('SessionService', () => {
  let service: SessionService;

  // 1. Mock do EventBus (Simula o ClientProxy do RabbitMQ)
  // Como só usamos o método .emit() no código, só precisamos mockar ele.
  const mockEventBus = {
    emit: jest.fn(),
  };

  // 2. Mock do PrismaService (Simula o Banco de Dados)
  // Mockamos a tabela seatReservation e o método create.
  const mockPrismaService = {
    seatReservation: {
      create: jest.fn(),
      // Se usares outros métodos como findUnique ou update, adiciona-os aqui:
      // update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        // 3. Fornecer o Mock do EVENT_BUS
        {
          provide: 'EVENT_BUS', // Este token deve ser EXATAMENTE igual ao usado no @Inject('EVENT_BUS')
          useValue: mockEventBus,
        },
        // 4. Fornecer o Mock do PrismaService
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});