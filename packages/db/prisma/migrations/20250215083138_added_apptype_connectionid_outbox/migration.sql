/*
  Warnings:

  - Added the required column `appType` to the `Outbox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `connectionId` to the `Outbox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Outbox" ADD COLUMN     "appType" TEXT NOT NULL,
ADD COLUMN     "connectionId" TEXT NOT NULL;
