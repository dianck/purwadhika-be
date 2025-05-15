/*
  Warnings:

  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- CreateEnum
CREATE TYPE "CategoryBlog" AS ENUM ('SPORT', 'HEALTH', 'FOOD', 'NEWS');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" SET DATA TYPE VARCHAR(100);

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "category" "CategoryBlog" NOT NULL,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blog_title_key" ON "Blog"("title");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
