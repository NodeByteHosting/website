-- AlterTable
ALTER TABLE "system_settings" ADD COLUMN     "databaseUrl" TEXT,
ADD COLUMN     "faviconUrl" TEXT,
ADD COLUMN     "isSetupComplete" BOOLEAN NOT NULL DEFAULT false;
