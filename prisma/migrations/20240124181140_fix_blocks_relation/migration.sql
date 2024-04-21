/*
  Warnings:

  - You are about to drop the column `flightId` on the `Blocks` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_BlocksToFlight" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_BlocksToFlight_A_fkey" FOREIGN KEY ("A") REFERENCES "Blocks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlocksToFlight_B_fkey" FOREIGN KEY ("B") REFERENCES "Flight" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Blocks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startFormation" TEXT NOT NULL,
    "endFormation" TEXT NOT NULL
);
INSERT INTO "new_Blocks" ("endFormation", "id", "startFormation") SELECT "endFormation", "id", "startFormation" FROM "Blocks";
DROP TABLE "Blocks";
ALTER TABLE "new_Blocks" RENAME TO "Blocks";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_BlocksToFlight_AB_unique" ON "_BlocksToFlight"("A", "B");

-- CreateIndex
CREATE INDEX "_BlocksToFlight_B_index" ON "_BlocksToFlight"("B");
