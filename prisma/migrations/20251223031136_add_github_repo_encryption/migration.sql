/*
  Warnings:

  - You are about to drop the column `adminEmail` on the `system_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "system_settings" DROP COLUMN "adminEmail",
ADD COLUMN     "githubRepositories" TEXT,
ADD COLUMN     "virtfusionApi" TEXT,
ADD COLUMN     "virtfusionApiKey" TEXT,
ADD COLUMN     "virtfusionUrl" TEXT;
