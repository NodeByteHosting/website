/*
  Warnings:

  - You are about to drop the column `configFrom` on the `eggs` table. All the data in the column will be lost.
  - You are about to drop the column `copyScriptFrom` on the `eggs` table. All the data in the column will be lost.
  - You are about to drop the column `dockerImage` on the `eggs` table. All the data in the column will be lost.
  - You are about to drop the column `dockerImages` on the `eggs` table. All the data in the column will be lost.
  - You are about to drop the column `scriptIsPrivileged` on the `eggs` table. All the data in the column will be lost.
  - You are about to drop the column `startup` on the `eggs` table. All the data in the column will be lost.
  - You are about to drop the column `allocationLimit` on the `servers` table. All the data in the column will be lost.
  - You are about to drop the column `backupLimit` on the `servers` table. All the data in the column will be lost.
  - You are about to drop the column `cpu` on the `servers` table. All the data in the column will be lost.
  - You are about to drop the column `databaseLimit` on the `servers` table. All the data in the column will be lost.
  - You are about to drop the column `disk` on the `servers` table. All the data in the column will be lost.
  - You are about to drop the column `featureLimits` on the `servers` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `servers` table. All the data in the column will be lost.
  - You are about to drop the column `io` on the `servers` table. All the data in the column will be lost.
  - You are about to drop the column `memory` on the `servers` table. All the data in the column will be lost.
  - You are about to drop the column `oomDisabled` on the `servers` table. All the data in the column will be lost.
  - You are about to drop the column `startup` on the `servers` table. All the data in the column will be lost.
  - You are about to drop the column `swap` on the `servers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[virtfusionId]` on the table `servers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "servers" DROP CONSTRAINT "servers_eggId_fkey";

-- DropForeignKey
ALTER TABLE "servers" DROP CONSTRAINT "servers_ownerId_fkey";

-- DropIndex
DROP INDEX "users_pterodactylId_key";

-- AlterTable
ALTER TABLE "eggs" DROP COLUMN "configFrom",
DROP COLUMN "copyScriptFrom",
DROP COLUMN "dockerImage",
DROP COLUMN "dockerImages",
DROP COLUMN "scriptIsPrivileged",
DROP COLUMN "startup",
ADD COLUMN     "panelType" TEXT NOT NULL DEFAULT 'pterodactyl';

-- AlterTable
ALTER TABLE "nodes" ADD COLUMN     "panelType" TEXT NOT NULL DEFAULT 'pterodactyl';

-- AlterTable
ALTER TABLE "servers" DROP COLUMN "allocationLimit",
DROP COLUMN "backupLimit",
DROP COLUMN "cpu",
DROP COLUMN "databaseLimit",
DROP COLUMN "disk",
DROP COLUMN "featureLimits",
DROP COLUMN "image",
DROP COLUMN "io",
DROP COLUMN "memory",
DROP COLUMN "oomDisabled",
DROP COLUMN "startup",
DROP COLUMN "swap",
ADD COLUMN     "panelType" TEXT NOT NULL DEFAULT 'pterodactyl',
ADD COLUMN     "productId" TEXT,
ADD COLUMN     "virtfusionId" INTEGER,
ALTER COLUMN "pterodactylId" DROP NOT NULL,
ALTER COLUMN "eggId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accountBalance" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "accountStatus" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "billingEmail" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "virtfusionId" INTEGER;

-- CreateTable
CREATE TABLE "egg_properties" (
    "id" TEXT NOT NULL,
    "eggId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "panelType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "egg_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_properties" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "server_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "setupFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billingCycle" TEXT NOT NULL DEFAULT 'monthly',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "creatorId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "paid" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "dueDate" TIMESTAMP(3),
    "paidDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "productId" TEXT,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "method" TEXT NOT NULL,
    "reference" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serverId" TEXT,
    "subject" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "status" TEXT NOT NULL DEFAULT 'open',
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_ticket_replies" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "attachments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_ticket_replies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "egg_properties_eggId_idx" ON "egg_properties"("eggId");

-- CreateIndex
CREATE UNIQUE INDEX "egg_properties_eggId_key_panelType_key" ON "egg_properties"("eggId", "key", "panelType");

-- CreateIndex
CREATE INDEX "server_properties_serverId_idx" ON "server_properties"("serverId");

-- CreateIndex
CREATE UNIQUE INDEX "server_properties_serverId_key_key" ON "server_properties"("serverId", "key");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "products_isActive_idx" ON "products"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_userId_idx" ON "invoices"("userId");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoices_dueDate_idx" ON "invoices"("dueDate");

-- CreateIndex
CREATE INDEX "payments_invoiceId_idx" ON "payments"("invoiceId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "support_tickets_ticketNumber_key" ON "support_tickets"("ticketNumber");

-- CreateIndex
CREATE INDEX "support_tickets_userId_idx" ON "support_tickets"("userId");

-- CreateIndex
CREATE INDEX "support_tickets_status_idx" ON "support_tickets"("status");

-- CreateIndex
CREATE INDEX "support_tickets_priority_idx" ON "support_tickets"("priority");

-- CreateIndex
CREATE INDEX "support_tickets_category_idx" ON "support_tickets"("category");

-- CreateIndex
CREATE INDEX "support_tickets_assignedToId_idx" ON "support_tickets"("assignedToId");

-- CreateIndex
CREATE INDEX "support_ticket_replies_ticketId_idx" ON "support_ticket_replies"("ticketId");

-- CreateIndex
CREATE INDEX "support_ticket_replies_userId_idx" ON "support_ticket_replies"("userId");

-- CreateIndex
CREATE INDEX "eggs_panelType_idx" ON "eggs"("panelType");

-- CreateIndex
CREATE INDEX "nodes_panelType_idx" ON "nodes"("panelType");

-- CreateIndex
CREATE UNIQUE INDEX "servers_virtfusionId_key" ON "servers"("virtfusionId");

-- CreateIndex
CREATE INDEX "servers_panelType_idx" ON "servers"("panelType");

-- CreateIndex
CREATE INDEX "servers_ownerId_idx" ON "servers"("ownerId");

-- CreateIndex
CREATE INDEX "servers_productId_idx" ON "servers"("productId");

-- AddForeignKey
ALTER TABLE "egg_properties" ADD CONSTRAINT "egg_properties_eggId_fkey" FOREIGN KEY ("eggId") REFERENCES "eggs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_eggId_fkey" FOREIGN KEY ("eggId") REFERENCES "eggs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_properties" ADD CONSTRAINT "server_properties_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_ticket_replies" ADD CONSTRAINT "support_ticket_replies_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_ticket_replies" ADD CONSTRAINT "support_ticket_replies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
