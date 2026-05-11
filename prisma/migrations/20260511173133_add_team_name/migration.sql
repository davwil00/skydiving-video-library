-- AlterTable
ALTER TABLE "Session" ADD COLUMN "team" TEXT;
UPDATE "Session" SET "team" = 'cookies';
