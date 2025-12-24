-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "averageRating" SMALLINT NOT NULL DEFAULT 7,
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 20000;

-- CreateTable
CREATE TABLE "Ratings" (
    "ratingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ratings_pkey" PRIMARY KEY ("ratingId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ratings_contentId_userId_key" ON "Ratings"("contentId", "userId");

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("contentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
