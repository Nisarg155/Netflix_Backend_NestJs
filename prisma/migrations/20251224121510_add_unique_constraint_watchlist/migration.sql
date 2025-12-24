/*
  Warnings:

  - A unique constraint covering the columns `[contentId]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_contentId_key" ON "Watchlist"("contentId");
