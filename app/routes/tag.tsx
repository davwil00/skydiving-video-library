import { Form, useLoaderData } from "@remix-run/react";
import { readdir } from "fs/promises";
import { VIDEO_DATA_PATH } from "~/routes/sync-db";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { format } from "date-fns";
import { writeTag } from "~/utils/tagUtils";
import { CloneIcon } from "~/components/icons";


export const loader = async () => {
  const pendingDir = await readdir(`${VIDEO_DATA_PATH}/pending`, {
    withFileTypes: true
  });

  const files: string[] = pendingDir
    .filter(file => file.name.endsWith(".mp4"))
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
    }

    await writeTag(`${VIDEO_DATA_PATH}/pending/${fileName}`, tags)
  }

  return null
};

export default function Tag() {
  const { files } = useLoaderData<typeof loader>();
  return (
    <Form method={"POST"}>
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
                <input type="date" className="input input-bordered join-item tag-date" name={`date${idx}`} />
                <button className="btn join-item" type="button">
                  <CloneIcon className="fill-white rounded-none"/>
                </button>
              </div>
            </td>
            <td>
              <input type="text" className="input input-bordered" defaultValue="David F/David W/Karen/Nick"
                     name={`flyers${idx}`} />
            </td>
            <td><input type="text" pattern="[A-HJ-Q0-9]+" className="input input-bordered" name={`formations${idx}`} /></td>
            <td>
              <select className="select input-bordered" name={`view${idx}`} defaultValue={`${file.startsWith("source01") ? "Side" : "Top"}`}>
                <option value="Top">Top</option>
                <option value="Side">Side</option>
              </select>
            </td>
          </tr>
        )}
        </tbody>
      </table>

      <button className="btn" type="submit">Save</button>
    </Form>
  );
}
