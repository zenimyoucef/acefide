-- AlterTable: Add facebookUrl to News
ALTER TABLE "News" ADD COLUMN "facebookUrl" TEXT;

-- AlterTable: Add externalUrl to Event
ALTER TABLE "Event" ADD COLUMN "externalUrl" TEXT;
