import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // 1. Criar um Filme
  const movie = await prisma.movie.create({
    data: {
      title: 'A Origem (Inception)',
      description: 'Um ladrão que rouba segredos corporativos através do uso de tecnologia de compartilhamento de sonhos.',
      durationMin: 148,
      genre: 'Sci-Fi',
      releaseDate: new Date('2010-07-16T00:00:00Z'),
      posterUrl: 'https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    },
  });
  console.log(`Filme criado: ${movie.title}`);

  // 2. Criar uma Sala (IMAX)
  const room = await prisma.room.create({
    data: {
      name: 'Sala 1 - IMAX',
      capacity: 20, // Pequena para teste
    },
  });
  console.log(`r Sala criada: ${room.name}`);

  // 3. Gerar Assentos (Layout 4x5)
  // Vamos criar assentos físicos para esta sala
  const rows = ['A', 'B', 'C', 'D'];
  interface SeatData {
    row: string;
    number: number;
    roomId: string;
  }

  const seatsData: SeatData[] = [];

  for (const row of rows) {
    for (let number = 1; number <= 5; number++) {
      seatsData.push({
        row,
        number,
        roomId: room.id,
      });
    }
  }

  await prisma.seat.createMany({
    data: seatsData,
  });
  console.log(`${seatsData.length} assentos criados para a sala.`);

  // 4. Criar uma Sessão para hoje à noite
  const session = await prisma.session.create({
    data: {
      movieId: movie.id,
      roomId: room.id,
      startTime: new Date(new Date().setHours(20, 0, 0, 0)), // Hoje as 20h
    },
  });
  console.log(`Sessão criada para as 20h (ID: ${session.id})`);

  // NOTA SOBRE CQRS:
  // Normalmente, o SessionService enviaria eventos para criar os SessionSeats.
  // Mas para testar a leitura do catálogo, vamos iniciar o estado como "livre" aqui.

  // Buscar os assentos recém criados
  const seats = await prisma.seat.findMany({ where: { roomId: room.id } });

  const sessionSeatsData = seats.map((seat) => ({
    sessionId: session.id,
    seatId: seat.id,
    isBooked: false, // Todos livres inicialmente
  }));

  await prisma.sessionSeat.createMany({
    data: sessionSeatsData,
  });
  console.log(`Estado CQRS (SessionSeats) inicializado.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });