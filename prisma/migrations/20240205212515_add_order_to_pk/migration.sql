/*
  Warnings:

  - The primary key for the `FlightFormation` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FlightFormation" (
    "flightId" TEXT NOT NULL,
    "formationLetter" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    PRIMARY KEY ("flightId", "formationLetter", "order"),
    CONSTRAINT "FlightFormation_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FlightFormation_formationLetter_fkey" FOREIGN KEY ("formationLetter") REFERENCES "Formation" ("letter") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FlightFormation" ("flightId", "formationLetter", "order") SELECT "flightId", "formationLetter", "order" FROM "FlightFormation";
DROP TABLE "FlightFormation";
ALTER TABLE "new_FlightFormation" RENAME TO "FlightFormation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
