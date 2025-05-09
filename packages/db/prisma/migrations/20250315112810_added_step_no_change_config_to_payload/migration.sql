/*
  Warnings:

  - You are about to drop the column `config` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `config` on the `Trigger` table. All the data in the column will be lost.
  - Added the required column `payload` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payload` to the `Trigger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stepNo` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "config",
ADD COLUMN     "payload" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "config",
ADD COLUMN     "payload" JSONB NOT NULL,
ADD COLUMN     "stepNo" INTEGER NOT NULL;
