/*
  Warnings:

  - Added the required column `videoUrl` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    CONSTRAINT "Flight_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Flight" ("id", "sessionId") SELECT "id", "sessionId" FROM "Flight";
DROP TABLE "Flight";
ALTER TABLE "new_Flight" RENAME TO "Flight";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
