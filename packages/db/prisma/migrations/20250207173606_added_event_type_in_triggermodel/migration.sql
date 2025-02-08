/*
  Warnings:

  - Added the required column `eventType` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "eventType" TEXT NOT NULL;
