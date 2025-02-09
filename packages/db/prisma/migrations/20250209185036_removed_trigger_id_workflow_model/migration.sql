/*
  Warnings:

  - You are about to drop the column `triggerId` on the `Workflow` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Workflow_triggerId_key";

-- AlterTable
ALTER TABLE "Workflow" DROP COLUMN "triggerId";
