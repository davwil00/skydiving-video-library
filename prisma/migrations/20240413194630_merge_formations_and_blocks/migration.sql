CREATE TABLE "new_FlightFormation" (
   "flightId" TEXT NOT NULL,
   "formationId" TEXT NOT NULL,
   "order" INTEGER NOT NULL,

   PRIMARY KEY ("flightId", "formationId", "order"),
   CONSTRAINT "FlightFormation_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_FlightFormation" ("flightId", "formationId", "order")
    SELECT "flightId", "formationLetter", "order" FROM "FlightFormation";
INSERT INTO "new_FlightFormation" ("flightId", "formationId", "order")
SELECT "B",
       "A",
       "order"
FROM "_BlocksToFlight" btf
         JOIN (SELECT "flightId", max("order") + 1 AS "order"
               FROM "FlightFormation" ff
               GROUP BY ff."flightId") AS ff
              ON btf."B" = ff."flightId";

DROP TABLE "_BlocksToFlight";
DROP TABLE "FlightFormation";
DROP TABLE "Formation";
DROP TABLE "Blocks";

ALTER TABLE "new_FlightFormation" RENAME TO "FlightFormation";
