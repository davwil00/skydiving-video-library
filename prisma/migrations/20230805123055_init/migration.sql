-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "Flight_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Flyer" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Formation" (
    "letter" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FlightToFlyer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FlightToFlyer_A_fkey" FOREIGN KEY ("A") REFERENCES "Flight" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FlightToFlyer_B_fkey" FOREIGN KEY ("B") REFERENCES "Flyer" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FlightToFormation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FlightToFormation_A_fkey" FOREIGN KEY ("A") REFERENCES "Flight" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FlightToFormation_B_fkey" FOREIGN KEY ("B") REFERENCES "Formation" ("letter") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_FlightToFlyer_AB_unique" ON "_FlightToFlyer"("A", "B");

-- CreateIndex
CREATE INDEX "_FlightToFlyer_B_index" ON "_FlightToFlyer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FlightToFormation_AB_unique" ON "_FlightToFormation"("A", "B");

-- CreateIndex
CREATE INDEX "_FlightToFormation_B_index" ON "_FlightToFormation"("B");
