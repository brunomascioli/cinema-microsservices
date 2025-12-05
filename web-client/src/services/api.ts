import axios from 'axios';
import { Movie, Session, SessionDetails } from '../types';

// Se o backend estiver rodando, ele provavelmente está na porta 3000
const API_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

// --- FUNÇÕES DE SERVIÇO ---

// Tenta buscar do backend, se falhar (erro de rede), retorna dados falsos para você não travar
export const getMovies = async (): Promise<Movie[]> => {
  try {
    // Rota correta com o prefixo /catalog
    const response = await api.get<Movie[]>('/catalog/movies');
    return response.data;
  } catch (error) {
    console.warn("Backend indisponível ou rota inexistente. Usando MOCK DATA.");
    return [
      {
        id: '1',
        title: 'O Auto da Compadecida 2',
        description: 'João Grilo e Chicó retornam para novas aventuras.',
        durationMin: 135,
        genre: 'Comédia',
        releaseDate: new Date().toISOString(),
        posterUrl: 'https://upload.wikimedia.org/wikipedia/pt/b/bc/O_Auto_da_Compadecida_2_p%C3%B4ster.jpg'
      },
      {
        id: '2',
        title: 'Interestelar',
        description: 'Um grupo de astronautas viaja através de um buraco de minhoca.',
        durationMin: 169,
        genre: 'Ficção Científica',
        releaseDate: new Date().toISOString(),
        posterUrl: 'https://upload.wikimedia.org/wikipedia/pt/3/3a/Interstellar_Filme.jpg'
      }
    ];
  }
};

export const getMovieById = async (id: string): Promise<Movie & { sessions: Session[] }> => {
  try {
    // 1. Busca os dados do filme
    const movieReq = api.get<Movie>(`/catalog/movies/${id}`);
    
    // 2. Busca as sessões desse filme (Rota específica que vimos no log do backend)
    const sessionsReq = api.get<Session[]>(`/catalog/movies/${id}/sessions`);

    // Aguarda as duas requisições terminarem ao mesmo tempo
    const [movieRes, sessionsRes] = await Promise.all([movieReq, sessionsReq]);

    // Retorna os dados unidos
    return { 
      ...movieRes.data, 
      sessions: sessionsRes.data || [] // Garante que é um array
    };

  } catch (error) {
    console.warn("Erro ao buscar detalhes do filme. Retornando erro para a tela tratar.");
    throw error; // Lança o erro para a página mostrar a mensagem correta
  }
};

export const getSessionById = async (sessionId: string): Promise<SessionDetails> => {
  try {
    const response = await api.get<SessionDetails>(`/catalog/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.warn("Erro ao buscar sessão.");
    throw error;
  }
};