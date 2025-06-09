-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "folderID" INTEGER;

-- CreateTable
CREATE TABLE "Folders" (
    "id" SERIAL NOT NULL,
    "folderName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Folders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Folders_folderName_key" ON "Folders"("folderName");

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_folderID_fkey" FOREIGN KEY ("folderID") REFERENCES "Folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
