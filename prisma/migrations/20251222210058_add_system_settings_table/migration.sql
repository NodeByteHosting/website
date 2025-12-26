-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "pterodactylUrl" TEXT,
    "pterodactylApiKey" TEXT,
    "registrationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "autoSyncEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "discordNotifications" BOOLEAN NOT NULL DEFAULT false,
    "discordWebhook" TEXT,
    "cacheTimeout" INTEGER NOT NULL DEFAULT 60,
    "syncInterval" INTEGER NOT NULL DEFAULT 3600,
    "adminEmail" TEXT,
    "siteName" TEXT NOT NULL DEFAULT 'NodeByte Hosting',
    "siteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);
