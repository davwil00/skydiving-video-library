import { type ActionArgs, json } from "@remix-run/node";
import { mkdir, readdir, rename } from "fs/promises";
import { type Dirent } from "fs";
import { getOrCreateSession } from "~/models/sessions.server";
import { createFlight } from "~/models/flights.server";
import { format } from "date-fns";
import { useLoaderData } from "@remix-run/react";
import { readTag } from "~/utils/tagUtils";

export const VIDEO_DATA_PATH = "./public/video-data";

export const action = async ({ request }: ActionArgs) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  // search pending folder, read tags and move to library
  const pendingDir = await readdir(`${VIDEO_DATA_PATH}/pending`, {
    withFileTypes: true
  });
  if (pendingDir.length == 0) {
    return json({ message: "Nothing to sync" }, 200);
  }

  for (const file of pendingDir) {
    console.log(`Found pending video file: ${file.name}`);
    const videoData = await processFile(file);
    if (videoData) {
      const sessionId = await getOrCreateSession(videoData.date);
      const newPath = `${VIDEO_DATA_PATH}/library/${format(
        videoData.date,
        "yyyy-MM-dd"
      )}`;
      await createFlight({
        sessionId,
        ...videoData,
        videoUrl: `${newPath.substring(8)}/${file.name}`
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
    const tags = await readTag(`${VIDEO_DATA_PATH}/pending/${file.name}`)
    const title: string[] = tags.title?.split("") || [];
    return {
      formations: title.filter(group => /[A-Z]/.test(group)),
      blocks: title.filter(group => /[0-9]/.test(group)).map(group => parseInt(group)),
      flyers: tags.artist!.split("/"),
      date: new Date(tags.date!),
      view: tags.comment!
    };
  }
}

type VideoData = {
  formations: string[];
  blocks: number[];
  flyers: string[];
  date: Date;
  view: string;
};

export const loader = async () => {
  const pendingDir = await readdir(`${VIDEO_DATA_PATH}/pending`, {
    withFileTypes: true
  });

  const videoData = await Promise.all(pendingDir
    .filter(file => file.name.endsWith(".mp4"))
    .map(async file => {
      const videoData = await processFile(file)
      if (videoData === undefined) {
        return null
      } else {
        return {
          fileName: file.name,
          ...videoData
        }
      }
    }));

  return json({ videoData });
};

export default function SyncDb() {
  const { videoData } = useLoaderData<typeof loader>();

  return (
    <div>
      <table className="table">
        <thead>
        <tr>
          <th>File</th>
          <th>Date</th>
          <th>Flyers</th>
          <th>Formations</th>
          <th>Blocks</th>
          <th>View</th>
        </tr>
        </thead>
        <tbody>
        {videoData.map((data, idx) =>
          data != null ? <tr key={idx}>
            <td>{data.fileName}</td>
            <td>{format(new Date(data.date), "dd-MM-yyyy")}</td>
            <td>{data.flyers.join(",")}</td>
            <td>{data.formations}</td>
            <td>{data.blocks}</td>
            <td>{data.view}</td>
          </tr> : null
        )}
        </tbody>
      </table>

      <form method="POST">
        <button className="btn" type="submit">Import</button>
      </form>
    </div>
  );
}
