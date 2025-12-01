import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

/**
 * Interface de Borda para o Microsserviço de Sessão (Gerenciamento de Estado).
 * * Responsabilidade: Notificar o serviço de sessão quando o catálogo cria
 * uma nova programação, para que ele possa inicializar o mapa de assentos.
 */
@Injectable()
export class SessionIntegrationService {
  private readonly logger = new Logger(SessionIntegrationService.name);
  // URL viria de variáveis de ambiente (ConfigService)
  private readonly sessionServiceUrl = 'http://session-service:3000';

  constructor(private readonly httpService: HttpService) { }

  /**
   * Notifica o microsserviço de sessão para inicializar o estado (assentos livres).
   * Chamada Async (Fire-and-forget ou aguarda confirmação dependendo da consistência desejada).
   */
  async initializeSessionState(sessionId: string, roomId: string, totalSeats: number): Promise<void> {
    this.logger.log(`Notificando SessionService para inicializar sessão: ${sessionId}`);

    try {
      await firstValueFrom(
        this.httpService.post(`${this.sessionServiceUrl}/internal/sessions/init`, {
          catalogSessionId: sessionId,
          roomId: roomId,
          capacity: totalSeats,
        })
      );
    } catch (error) {
      this.logger.error(`Falha ao comunicar com SessionService: ${error.message}`);
      // Lógica de Retry ou Dead Letter Queue seria implementada aqui
      throw error;
    }
  }

  /**
   * Verifica disponibilidade (apenas leitura, se o Catálogo precisar exibir status lotado).
   */
  async getSessionStatus(sessionId: string): Promise<{ isFull: boolean; availableSeats: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.sessionServiceUrl}/internal/sessions/${sessionId}/status`)
      );
      return response.data;
    } catch (error) {
      this.logger.warn(`Não foi possível obter status da sessão ${sessionId}`);
      return { isFull: false, availableSeats: 0 }; // Fallback seguro
    }
  }
}