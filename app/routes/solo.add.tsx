import { redirect, useLoaderData, data } from "react-router";
import { createSoloSession } from "~/models/solo-sessions.server";
import { VIDEO_DATA_PATH } from "~/routes/sync-db";
import { mkdir, readdir, rename } from "fs/promises";
import { Dirent } from "fs";
import { getDuration, trim } from "~/utils/ffmpegUtils";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";
import type { Route } from './+types/solo.add';

async function getAllFiles() {
  const videoDataPath = `${VIDEO_DATA_PATH}/solo/pending`;
  return await readdir(`${videoDataPath}`, {
    withFileTypes: true
  });
}

function trimAllPendingFiles(files: Dirent[]): Promise<string | void>[] {
  console.info('trimming files')
  return files.map(async file => {
    const duration = await getDuration(`${file.parentPath}/${file.name}`);
    await trim(`/video-data/solo/pending/${file.name}`, "12", `${parseFloat(duration) - 15}`);
  });
}

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return data({ message: "Method not allowed", status: 405 });
  }

  const formData = await request.formData();

  const createSoloSessionData: Prisma.SoloSessionCreateInput = {
    date: new Date(formData.get("date") as string),
    duration: parseInt(formData.get("duration") as string),
    notes: formData.get("notes") as string,
    skills: formData.get("skills") as string
  };

  const pendingDir = await getAllFiles();
  if (formData.get("trim") === "on") {
    try {
      await Promise.all(trimAllPendingFiles(pendingDir));
    } catch (e) {
      console.error(e);
      return data({ message: "Error trimming files", status: 500 });
    }
  }

  const date = format(createSoloSessionData.date, "yyyy-MM-dd");
  const fileNames = pendingDir.map(file => `/video-data/solo/library/${date}/${file.name}`);
  createSoloSessionData.flights = {
    create: fileNames.map(fileName => ({ videoUrl: fileName }))
  }

  const session = await createSoloSession(createSoloSessionData);
  const newPath = `${VIDEO_DATA_PATH}/solo/library/${date}`;
  await mkdir(newPath, { recursive: true });
  for (const file of pendingDir) {
    await rename(
      `${VIDEO_DATA_PATH}/solo/pending/${file.name}`,
      `${newPath}/${file.name}`
    );
  }
  return redirect(`/solo/${session.id}`);
};

export const loader = async () => {
  const pendingDir = await getAllFiles();
  const files = pendingDir.map(file => `/video-data/solo/pending/${file.name}`);
  return { files };
};

export default function AddSoloSession() {
  const { files } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Add Solo Session</h1>
      <form method="post">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Date</span>
          </div>
          <input type="date" className="input input-bordered" name="date" />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Duration (mins)</span>
          </div>
          <input type="number" className="input input-bordered" name="duration" />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Notes</span>
          </div>
          <textarea className="textarea textarea-lg textarea-bordered" name="notes" rows={5} />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Skills</span>
          </div>
          <input type="text" className="input input-bordered" name="skills" />
        </label>
        <label className="form-control fieldset-label mt-4">
          <input type="checkbox" defaultChecked className="checkbox" name="trim" />
          Trim
        </label>
        <div className="flex flex-wrap gap-1">
          {files.map((file, idx) => (
            <video src={file} muted={true} controls={true} key={idx} className="w-1/3" />
          ))}
        </div>
        <button type="submit" className="btn mt-4">Add</button>
      </form>
    </div>
  );
}
