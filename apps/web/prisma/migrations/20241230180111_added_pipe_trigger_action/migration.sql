/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `userId` on the `Account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP CONSTRAINT "Account_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Pipe" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Pipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "pipeId" TEXT NOT NULL,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_pipeId_key" ON "Trigger"("pipeId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pipe" ADD CONSTRAINT "Pipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_pipeId_fkey" FOREIGN KEY ("pipeId") REFERENCES "Pipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "Trigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
