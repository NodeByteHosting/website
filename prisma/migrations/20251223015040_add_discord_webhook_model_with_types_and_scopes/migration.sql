-- CreateEnum
CREATE TYPE "DiscordWebhookType" AS ENUM ('GAME_SERVER', 'VPS', 'SYSTEM', 'BILLING', 'SECURITY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "DiscordWebhookScope" AS ENUM ('ADMIN', 'USER', 'PUBLIC');

-- CreateTable
CREATE TABLE "discord_webhooks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "webhookUrl" TEXT NOT NULL,
    "type" "DiscordWebhookType" NOT NULL,
    "scope" "DiscordWebhookScope" NOT NULL DEFAULT 'ADMIN',
    "description" TEXT,
    "userId" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "testSuccessAt" TIMESTAMP(3),
    "avatarUrl" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discord_webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "discord_webhooks_userId_idx" ON "discord_webhooks"("userId");

-- CreateIndex
CREATE INDEX "discord_webhooks_type_idx" ON "discord_webhooks"("type");

-- CreateIndex
CREATE INDEX "discord_webhooks_scope_idx" ON "discord_webhooks"("scope");

-- CreateIndex
CREATE UNIQUE INDEX "discord_webhooks_webhookUrl_userId_key" ON "discord_webhooks"("webhookUrl", "userId");

-- AddForeignKey
ALTER TABLE "discord_webhooks" ADD CONSTRAINT "discord_webhooks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
