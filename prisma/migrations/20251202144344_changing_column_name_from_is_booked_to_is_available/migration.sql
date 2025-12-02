/*
  Warnings:

  - You are about to drop the column `isBooked` on the `session_seats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "session_seats" DROP COLUMN "isBooked",
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT false;
