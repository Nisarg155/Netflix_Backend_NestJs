-- DropForeignKey
ALTER TABLE "Watchlist" DROP CONSTRAINT "Watchlist_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Watchlist" DROP CONSTRAINT "Watchlist_userId_fkey";

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("contentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
