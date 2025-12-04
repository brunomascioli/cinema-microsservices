-- CreateTable
CREATE TABLE "movies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "posterUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seats" (
    "id" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "movieId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_seats" (
    "id" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "sessionId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_seats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_seats_sessionId_seatId_key" ON "session_seats"("sessionId", "seatId");

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_seats" ADD CONSTRAINT "session_seats_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_seats" ADD CONSTRAINT "session_seats_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "seats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
