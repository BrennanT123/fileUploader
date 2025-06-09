/*
  Warnings:

  - A unique constraint covering the columns `[folderName,userId]` on the table `Folders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Folders_folderName_key";

-- CreateIndex
CREATE UNIQUE INDEX "Folders_folderName_userId_key" ON "Folders"("folderName", "userId");
