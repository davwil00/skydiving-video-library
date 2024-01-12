import { Form, useLoaderData } from "@remix-run/react";
import { readdir } from "fs/promises";
import { VIDEO_DATA_PATH } from "~/routes/sync-db";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { format } from "date-fns";
import { writeTag } from "~/utils/tagUtils";
import { PlayIcon } from "~/components/icons";
import { useRef, useState } from "react";


export const loader = async () => {
  const pendingDir = await readdir(`${VIDEO_DATA_PATH}/pending`, {
    withFileTypes: true
  });

  const files: string[] = pendingDir
    .filter(file => file.name.endsWith(".mp4") || file.name.endsWith(".av1"))
    .map(file => file.name);

  return json({ files });
};

export const action = async ({ request }: ActionArgs) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  const formData = await request.formData();
  const numberOfFiles = parseInt(formData.get("numberOfFiles") as string);

  for (let i = 0; i < numberOfFiles; i++) {
    const fileName = formData.get(`fileName${i}`);
    const date = new Date(formData.get(`date${i}`) as string);
    const flyers = formData.get(`flyers${i}`);
    const formations = formData.get(`formations${i}`);
    const view = formData.get(`view${i}`);

    const tags = {
      date: format(date, "yyyy-MM-dd"),
      title: formations as string,
      artist: flyers as string,
      comment: view as string
    };

    await writeTag(`${VIDEO_DATA_PATH}/pending/${fileName}`, tags);
  }

  return null;
};

export default function Tag() {
  const { files } = useLoaderData<typeof loader>();
  const [videoPreviewData, setVideoPreviewData] = useState<string>();
  const [date, setDate] = useState<string>();
  const modalRef = useRef<HTMLDialogElement>(null);
  const defaultDateRef = useRef<HTMLInputElement>(null);

  function openVideoPreview(fileName: string) {
    setVideoPreviewData(fileName);
    modalRef?.current?.showModal();
  }

  return (
    <Form method={"POST"}>
      <div><label>Set Date:<input type="date" className="input input-bordered" ref={defaultDateRef} /></label>
        <button type="button" className="btn" onClick={() => setDate(defaultDateRef?.current?.value)}>Set date</button>
      </div>
      <input type="hidden" value={files.length} name="numberOfFiles" />
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
        {files.map((file, idx) =>
          <tr key={idx}>
            <td>{file}<input type="hidden" value={file} name={`fileName${idx}`} /></td>
            <td>
              <div className="join">
                <input type="date" className="input input-bordered join-item tag-date" name={`date${idx}`}
                       defaultValue={date} />
              </div>
            </td>
            <td>
              <input type="text" className="input input-bordered" defaultValue="David F/David W/Karen/Nick"
                     name={`flyers${idx}`} />
            </td>
            <td><input type="text" pattern="[A-HJ-Q0-9]+" className="input input-bordered" name={`formations${idx}`} />
            </td>
            <td>
              <select className="select input-bordered" name={`view${idx}`}
                      defaultValue={`${file.startsWith("source01") ? "SIDE" : "TOP"}`}>
                <option value="TOP">Top</option>
                <option value="SIDE">Side</option>
              </select>
            </td>
            <td>
              <button type="button" onClick={() => openVideoPreview(file)}><PlayIcon /></button>
            </td>
          </tr>
        )}
        </tbody>
      </table>

      <dialog id="video-preview" className="modal" ref={modalRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{videoPreviewData}</h3>
          <video src={`/video-data/pending/${videoPreviewData}`} controls />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <button className="btn" type="submit">Save</button>
    </Form>
  );
}
