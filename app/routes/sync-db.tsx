import {mkdir, readdir, rename} from "fs/promises";
import {getOrCreateSession} from "~/models/sessions.server";
import {createFlight} from "~/models/flights.server";
import {format} from "date-fns";
import { data, useLoaderData } from "react-router";
import {processFile} from "~/utils/tagUtils";
import { type ActionFunctionArgs } from "react-router";

export const VIDEO_DATA_PATH = "./public/video-data"

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return data({ message: "Method not allowed", status: 405 })
  }

  // search pending folder, read tags and move to library
  const pendingDir = await readdir(`${VIDEO_DATA_PATH}/pending`, {
    withFileTypes: true
  });
  if (pendingDir.length == 0) {
    return data({ message: "Nothing to sync", status: 200 })
  }

  for (const file of pendingDir) {
    console.log(`Found pending video file: ${file.name}`);
    const videoData = await processFile(file, `${VIDEO_DATA_PATH}/pending`);
    if (videoData) {
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
      await mkdir(newPath, { recursive: true })
      await rename(
        `${VIDEO_DATA_PATH}/pending/${file.name}`,
        `${newPath}/${file.name}`
      );
      console.log(`Processed ${file.name})`)
    }
  }
  return data({ message: "Sync complete", status: 201 });
};

export const loader = async () => {
  const pendingDir = await readdir(`${VIDEO_DATA_PATH}/pending`, {
    withFileTypes: true
  });

  const videoData = await Promise.all(pendingDir
    .filter(file => file.name.endsWith(".mp4") || file.name.endsWith(".av1"))
    .map(async file => {
      const videoData = await processFile(file, `${VIDEO_DATA_PATH}/pending`)
      if (videoData === undefined) {
        return null
      } else {
        return {
          fileName: file.name,
          ...videoData
        }
      }
    }));

  return { videoData };
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
          <th>View</th>
        </tr>
        </thead>
        <tbody>
        {videoData.map((data, idx) =>
          data != null ? <tr key={idx}>
            <td>{data.fileName}</td>
            <td>{format(new Date(data.date), "dd-MM-yyyy")}</td>
            <td>{data.flyers.join(",")}</td>
            <td>{data.formationIds.join(',')}</td>
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
