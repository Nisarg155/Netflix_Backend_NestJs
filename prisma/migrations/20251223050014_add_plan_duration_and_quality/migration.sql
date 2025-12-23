-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "duration" TEXT NOT NULL DEFAULT '30d',
ADD COLUMN     "maxQuality" TEXT NOT NULL DEFAULT 'HD';
