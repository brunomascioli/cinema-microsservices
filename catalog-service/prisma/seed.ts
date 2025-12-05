import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🧹 Limpando banco de dados...');
  // A ordem importa por causa das chaves estrangeiras
  await prisma.sessionSeat.deleteMany();
  await prisma.session.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.room.deleteMany();
  await prisma.movie.deleteMany();

  console.log('🌱 Iniciando seed...');

  // --- 1. CRIAR FILMES (Agora com 4 opções e URLs corretas) ---
  
  const movie1 = await prisma.movie.create({
    data: {
      title: 'A Origem',
      description: 'Um ladrão que rouba segredos corporativos através do uso de tecnologia de compartilhamento de sonhos é dada a tarefa inversa de plantar uma ideia na mente de um CEO.',
      durationMin: 148,
      genre: 'Sci-Fi',
      releaseDate: new Date('2010-07-16T00:00:00Z'),
      posterUrl: 'https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', // URL CORRETA DA ORIGEM
    },
  });

  const movie2 = await prisma.movie.create({
    data: {
      title: 'Interestelar',
      description: 'As reservas da Terra estão acabando e um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial.',
      durationMin: 169,
      genre: 'Sci-Fi',
      releaseDate: new Date('2014-11-07T00:00:00Z'),
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',
    },
  });

  const movie3 = await prisma.movie.create({
    data: {
      title: 'Batman: O Cavaleiro das Trevas',
      description: 'Com a ajuda de Jim Gordon e Harvey Dent, Batman tem mantido a ordem na cidade de Gotham. Mas um jovem e anárquico criminoso conhecido como Coringa ganha força.',
      durationMin: 152,
      genre: 'Ação',
      releaseDate: new Date('2008-07-18T00:00:00Z'),
      posterUrl: 'https://upload.wikimedia.org/wikipedia/pt/d/d1/The_Dark_Knight.jpg',
    },
  });

  const movie4 = await prisma.movie.create({
    data: {
      title: 'Divertidamente 2',
      description: 'Com um salto temporal, Riley se encontra mais velha, passando pela tão temida adolescência. Junto com o amadurecimento, a sala de controle também está passando por uma adaptação para dar lugar a algo totalmente novo: as novas emoções.',
      durationMin: 96,
      genre: 'Animação',
      releaseDate: new Date('2024-06-20T00:00:00Z'),
      posterUrl: 'https://image.tmdb.org/t/p/original/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    },
  });

  console.log('✅ 4 Filmes criados com capas corretas.');

  // --- 2. CRIAR SALAS ---
  
  // Sala 1: Standard (Grande - 8 fileiras x 10 cadeiras)
  const roomStandard = await prisma.room.create({
    data: { name: 'Sala 1 - Standard', capacity: 80 },
  });

  // Sala 2: VIP (Pequena - 3 fileiras x 4 cadeiras)
  const roomVIP = await prisma.room.create({
    data: { name: 'Sala 2 - VIP (Reclinável)', capacity: 12 },
  });

  console.log('✅ 2 Salas criadas.');

  // --- 3. GERAR ASSENTOS ---

  const generateSeats = async (roomId: string, rows: string[], cols: number) => {
    // Tipagem explícita para evitar o erro do TypeScript 'never'
    const seatsData: { row: string; number: number; roomId: string }[] = [];

    for (const row of rows) {
      for (let number = 1; number <= cols; number++) {
        seatsData.push({ row, number, roomId });
      }
    }
    await prisma.seat.createMany({ data: seatsData });
  };

  // Gerar assentos da Sala Standard (A até H, 1-10)
  await generateSeats(roomStandard.id, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], 10);
  
  // Gerar assentos da Sala VIP (A até C, 1-4)
  await generateSeats(roomVIP.id, ['A', 'B', 'C'], 4);

  console.log('✅ Assentos gerados para ambas as salas.');

  // --- 4. CRIAR SESSÕES E DISPONIBILIDADE (CQRS) ---

  const createSessionWithSeats = async (movieId: string, roomId: string, hour: number, minute: number) => {
    // Ajusta data
    const startTime = new Date();
    startTime.setHours(hour, minute, 0, 0);
    if (startTime < new Date()) startTime.setDate(startTime.getDate() + 1);

    const session = await prisma.session.create({
      data: { movieId, roomId, startTime },
    });

    const seats = await prisma.seat.findMany({ where: { roomId } });

    const sessionSeatsData = seats.map((seat) => ({
      sessionId: session.id,
      seatId: seat.id,
      isAvailable: true,
    }));

    await prisma.sessionSeat.createMany({ data: sessionSeatsData });
    return session;
  };

  // --- Distribuição de Horários ---
  
  // Sala Standard (Grande)
  await createSessionWithSeats(movie4.id, roomStandard.id, 14, 0);  // Divertidamente 2 (14h)
  await createSessionWithSeats(movie3.id, roomStandard.id, 16, 30); // Batman (16h30)
  await createSessionWithSeats(movie1.id, roomStandard.id, 20, 0);  // A Origem (20h)

  // Sala VIP (Pequena)
  await createSessionWithSeats(movie2.id, roomVIP.id, 18, 0);       // Interestelar (18h)
  await createSessionWithSeats(movie4.id, roomVIP.id, 21, 30);      // Divertidamente 2 (21h30 - Legendado)

  console.log('✅ Sessões criadas e inicializadas.');
  console.log('🚀 Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });