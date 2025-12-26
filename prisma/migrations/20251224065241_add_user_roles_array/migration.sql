-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'PARTNER';
ALTER TYPE "Role" ADD VALUE 'SPONSOR';
ALTER TYPE "Role" ADD VALUE 'TECH_TEAM';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roles" "Role"[] DEFAULT ARRAY['MEMBER']::"Role"[];
