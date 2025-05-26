PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flight"
(
    "id"           TEXT NOT NULL PRIMARY KEY,
    "sessionId"    TEXT NOT NULL,
    "sideVideoUrl" TEXT,
    "topVideoUrl"  TEXT,
    CONSTRAINT "Flight_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Flight" ("id", "sessionId", "sideVideoUrl", "topVideoUrl")
SELECT id,
       sessionId,
       max(sideVideoUrl) AS sideViewUrl,
       max(topVideoUrl)  AS topViewUrl
FROM (SELECT substr(videoUrl, 41)                      AS videoId,
             CASE WHEN view = 'TOP'  THEN videoUrl END AS topVideoUrl,
             CASE WHEN view = 'SIDE' THEN videoUrl END AS sideVideoUrl,
             id,
             sessionId
      FROM Flight f) AS labelled_flights
GROUP BY videoId;

DROP TABLE "Flight";
ALTER TABLE "new_Flight" RENAME TO "Flight";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
