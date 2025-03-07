import type { Route } from "../../.react-router/types/app/routes/+types/trim-pending";
import { VIDEO_DATA_PATH } from "~/routes/sync-db";
import { readdir } from "fs/promises";
import { Dirent } from "fs";
import { useLoaderData } from "react-router";
import { getDuration, trim } from "~/utils/ffmpegUtils";
import { useState } from "react";

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  const formData = await request.formData();

  console.info("trimming files");
  for (const file of formData.entries()) {
    const fileName = `${VIDEO_DATA_PATH}/pending/${file[0]}`
    const duration = await getDuration(fileName);
    await trim(fileName, "12", `${parseFloat(duration) - 16}`);
  }

  return null
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const videoDataPath = url.searchParams.get("dir") || `${VIDEO_DATA_PATH}/pending`;
  const pendingDir = await readdir(`${videoDataPath}`, {
    withFileTypes: true
  });

  const files: Dirent[] = await Promise.all(pendingDir
    .filter(file => file.name.endsWith(".mp4"))
  );

  return { files };
};

export default function TrimPending() {
  const { files } = useLoaderData<typeof loader>();
  const [submitting, setSubmitting] = useState(false);

  return (
    <div>
      <h1>Trim Pending</h1>
      <form method="post">
        <table className="table">
          <thead>
          <tr>
            <th>File Name</th>
            <th>Trim</th>
          </tr>
          </thead>
          <tbody>
          {files.map(file => (
            <tr key={file.name}>
              <td>{file.name}</td>
              <td>
                <input type="checkbox" name={file.name} defaultChecked={file.name.startsWith("source01")} />
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        <button type="submit" className="btn" onClick={() => setSubmitting(true)}>
          Trim Selected
          {submitting ? <span className="loading loading-spinner"></span> : null}
        </button>
      </form>
    </div>
  );
}
