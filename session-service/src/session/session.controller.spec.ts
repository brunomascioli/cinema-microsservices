import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { ReserveSeatDto } from './dto/reserve-seat.dto';

describe('SessionController', () => {
  let controller: SessionController;
  let service: SessionService;

  const mockSessionService = {
    reserveSeat: jest.fn((dto) => {
      return Promise.resolve({
        success: true,
        message: 'Reserva simulada com sucesso',
        reservationId: 'mock-uuid-123'
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    }).compile();

    controller = module.get<SessionController>(SessionController);
    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Teste extra: Verifica se o controller realmente chama o service
  it('should call sessionService.reserveSeat with correct parameters', async () => {
    const dto: ReserveSeatDto = {
      sessionId: 'sessao_1',
      seatId: 'A1',
      userId: 'user_1'
    };

    await controller.reserve(dto);

    expect(service.reserveSeat).toHaveBeenCalledWith(dto);
  });
});