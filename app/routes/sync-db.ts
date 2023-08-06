import { type ActionArgs, json } from "@remix-run/node";
import { mkdir, readdir, rename } from "fs/promises";
import { type Dirent } from "fs";
import { orderTags, parseFile } from "music-metadata";
import { getOrCreateSession } from "~/models/sessions.server";
import { createFlight } from "~/models/flights.server";
import { format } from "date-fns";

const VIDEO_DATA_PATH = "./public/video-data";

export const action = async ({ request }: ActionArgs) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  // search pending folder, read tags and move to library
  const pendingDir = await readdir(`${VIDEO_DATA_PATH}/pending`, {
    withFileTypes: true,
  });
  if (pendingDir.length == 0) {
    return json({ message: "Nothing to sync" }, 200);
  }

  for (const file of pendingDir) {
    console.log(`Found pending video file: ${file.name}`);
    const videoData = await processFile(file);
    if (videoData && videoData.view === "Top") {
      const sessionId = await getOrCreateSession(videoData.date);
      const newPath = `${VIDEO_DATA_PATH}/library/${format(
        videoData.date,
        "yyyy-MM-dd"
      )}`;
      await createFlight({
        sessionId,
        ...videoData,
        videoUrl: `${newPath.substring(8)}/${file.name}`,
      });
      await mkdir(newPath, { recursive: true });
      await rename(
        `${VIDEO_DATA_PATH}/pending/${file.name}`,
        `${newPath}/${file.name}`
      );
      console.log(`Processed ${file.name})`);
    }
  }
  return json({ message: "Sync complete" }, 201);
};

async function processFile(file: Dirent): Promise<VideoData | undefined> {
  if (file.isFile() && file.name.endsWith(".mp4")) {
    const metadata = await parseFile(`${VIDEO_DATA_PATH}/pending/${file.name}`);
    const nativeTags = orderTags(metadata.native["iTunes"]);
    return {
      formations: metadata.common.grouping?.split("") || [],
      flyers: nativeTags["----:com.apple.iTunes:Ensemble"][0].split(","),
      date: new Date(metadata.common.date!),
      view: metadata.common.media!,
    };
  }
}

type VideoData = {
  formations: string[];
  flyers: string[];
  date: Date;
  view: string;
};
