CREATE TABLE "new_FlightFormation" (
   "flightId" TEXT NOT NULL,
   "formationId" TEXT NOT NULL,
   "order" INTEGER NOT NULL,

   PRIMARY KEY ("flightId", "formationId"),
   CONSTRAINT "FlightFormation_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_FlightFormation" ("flightId", "formationId", "order")
    SELECT "flightId", "formationLetter", "order" from "FlightFormation";
INSERT INTO "new_FlightFormation" ("flightId", "formationId", "order")
    SELECT
        "B",
        "A",
        (SELECT max("order")
         FROM "FlightFormation"
         WHERE flightId = ff.flightId) + 1 as "order"
    FROM "_BlocksToFlight" btf
    JOIN "FlightFormation" ff
      ON btf.B = ff.flightId;

DROP TABLE "_BlocksToFlight";
DROP TABLE "FlightFormation";
DROP TABLE "Formation";
DROP TABLE "Blocks";

ALTER TABLE "new_FlightFormation" RENAME TO "FlightFormation";
