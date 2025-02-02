-- CreateTable
CREATE TABLE "SoloSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "skills" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SoloFlight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "solo_session_id" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    CONSTRAINT "SoloFlight_solo_session_id_fkey" FOREIGN KEY ("solo_session_id") REFERENCES "SoloSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
