/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'SUPPORT_TEAM', 'ADMINISTRATOR', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isAdmin",
ADD COLUMN     "isPterodactylAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSystemAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVirtfusionAdmin" BOOLEAN NOT NULL DEFAULT false;
