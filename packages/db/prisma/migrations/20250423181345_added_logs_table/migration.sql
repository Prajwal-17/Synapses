-- DropIndex
DROP INDEX "Connection_userId_key";

-- AlterTable
ALTER TABLE "Connection" ALTER COLUMN "expiresAt" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Logs" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "stepNo" INTEGER NOT NULL,
    "appType" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
