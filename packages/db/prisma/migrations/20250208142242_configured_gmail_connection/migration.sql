/*
  Warnings:

  - A unique constraint covering the columns `[gmail]` on the table `GmailConnection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `connectionId` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "connectionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GmailConnection_gmail_key" ON "GmailConnection"("gmail");
