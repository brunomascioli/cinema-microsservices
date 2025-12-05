// Baseado no schema.prisma

export interface Movie {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  genre: string;
  releaseDate: string; // O JSON retorna datas como string ISO
  posterUrl?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface Session {
  id: string;
  startTime: string;
  movieId: string;
  roomId: string;
  room?: Room; // Pode vir populado ou não
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  roomId: string;
}

// Uma extensão da Sessão que inclui a Sala e os Assentos
export interface SessionDetails extends Session {
  room: Room & {
    seats: Seat[];
  };
}