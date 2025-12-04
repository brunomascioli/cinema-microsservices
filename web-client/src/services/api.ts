import axios from 'axios';
import { Movie, Session } from '../types';

// Se o backend estiver rodando, ele provavelmente está na porta 3000
const API_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

// --- FUNÇÕES DE SERVIÇO ---

// Tenta buscar do backend, se falhar (erro de rede), retorna dados falsos para você não travar
export const getMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get<Movie[]>('/movies'); // Rota provável do NestJS
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
    const response = await api.get(`/movies/${id}`);
    return response.data;
  } catch (error) {
    console.warn("Backend indisponível. Usando MOCK DATA para Detalhes.");
    
    // Simulando dados de sessões para o filme
    return {
      id: id,
      title: id === '1' ? 'O Auto da Compadecida 2' : 'Interestelar',
      description: 'Descrição completa do filme simulada...',
      durationMin: 120,
      genre: 'Simulação',
      releaseDate: new Date().toISOString(),
      posterUrl: id === '1' 
        ? 'https://upload.wikimedia.org/wikipedia/pt/b/bc/O_Auto_da_Compadecida_2_p%C3%B4ster.jpg'
        : 'https://upload.wikimedia.org/wikipedia/pt/3/3a/Interstellar_Filme.jpg',
      sessions: [
        {
          id: 'sess-1',
          startTime: new Date(new Date().setHours(14, 0)).toISOString(), // Hoje às 14h
          movieId: id,
          roomId: 'room-1',
          room: { id: 'room-1', name: 'Sala IMAX', capacity: 100 }
        },
        {
          id: 'sess-2',
          startTime: new Date(new Date().setHours(18, 30)).toISOString(), // Hoje às 18h30
          movieId: id,
          roomId: 'room-2',
          room: { id: 'room-2', name: 'Sala Standard', capacity: 50 }
        }
      ]
    };
  }
};