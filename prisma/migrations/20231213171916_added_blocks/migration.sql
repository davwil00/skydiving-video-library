-- CreateTable
CREATE TABLE "Blocks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startFormation" TEXT NOT NULL,
    "endFormation" TEXT NOT NULL,
    "flightId" TEXT,
    CONSTRAINT "Blocks_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
