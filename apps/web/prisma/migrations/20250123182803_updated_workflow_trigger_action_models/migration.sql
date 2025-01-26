/*
  Warnings:

  - A unique constraint covering the columns `[workflowId]` on the table `Trigger` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('trigger', 'action');

-- DropForeignKey
ALTER TABLE "Trigger" DROP CONSTRAINT "Trigger_id_fkey";

-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "type" "NodeType" NOT NULL DEFAULT 'action';

-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "type" "NodeType" NOT NULL DEFAULT 'trigger';

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_workflowId_key" ON "Trigger"("workflowId");

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
