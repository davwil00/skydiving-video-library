-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "flightId" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "dateAdded" DATETIME NOT NULL,
    CONSTRAINT "Note_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
