/*
  Warnings:

  - You are about to drop the column `triggerId` on the `Action` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_triggerId_fkey";

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "triggerId";
