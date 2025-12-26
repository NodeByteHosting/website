/*
  Warnings:

  - You are about to drop the column `discordWebhook` on the `system_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "system_settings" DROP COLUMN "discordWebhook",
ADD COLUMN     "crowdinPersonalToken" TEXT,
ADD COLUMN     "crowdinProjectId" TEXT,
ADD COLUMN     "discordWebhooks" TEXT,
ADD COLUMN     "pterodactylApi" TEXT,
ADD COLUMN     "resendApiKey" TEXT;
