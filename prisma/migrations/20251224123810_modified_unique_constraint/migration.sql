/*
  Warnings:

  - A unique constraint covering the columns `[contentId,userId]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Watchlist_contentId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_contentId_userId_key" ON "Watchlist"("contentId", "userId");
