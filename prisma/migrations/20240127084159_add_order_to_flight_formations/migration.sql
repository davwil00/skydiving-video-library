/*
  Warnings:

  - You are about to drop the `_FlightToFormation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_FlightToFormation";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "FlightFormation" (
    "flightId" TEXT NOT NULL,
    "formationLetter" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    PRIMARY KEY ("flightId", "formationLetter"),
    CONSTRAINT "FlightFormation_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FlightFormation_formationLetter_fkey" FOREIGN KEY ("formationLetter") REFERENCES "Formation" ("letter") ON DELETE RESTRICT ON UPDATE CASCADE
);
