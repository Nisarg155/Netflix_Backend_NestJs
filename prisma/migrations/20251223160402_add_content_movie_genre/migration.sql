-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('MOVIE', 'SHOW', 'SERIES');

-- CreateTable
CREATE TABLE "Genre" (
    "genreId" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("genreId")
);

-- CreateTable
CREATE TABLE "Content" (
    "contentId" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "details" TEXT,
    "language" TEXT[],
    "type" "ContentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("contentId")
);

-- CreateTable
CREATE TABLE "Movie" (
    "movieId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "movieUrl" VARCHAR(150) NOT NULL,
    "thumbnailUrl" VARCHAR(150) NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("movieId")
);

-- CreateTable
CREATE TABLE "ContentGenre" (
    "genreId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,

    CONSTRAINT "ContentGenre_pkey" PRIMARY KEY ("genreId","contentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_contentId_key" ON "Movie"("contentId");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("contentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentGenre" ADD CONSTRAINT "ContentGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("genreId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentGenre" ADD CONSTRAINT "ContentGenre_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("contentId") ON DELETE CASCADE ON UPDATE CASCADE;
