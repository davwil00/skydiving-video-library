import { useLoaderData } from "@remix-run/react";
import { readdir } from "fs/promises";
import { VIDEO_DATA_PATH } from "~/routes/sync-db";
import { json } from "@remix-run/node";
import { readTag, writeTag } from "~/utils/tagUtils";
import { CloneIcon, ErrorIcon, PlayIcon, SuccessIcon } from "~/components/icons";
import { useReducer } from "react";
import { type FileToTag, tagReducer, type TagState } from "~/state/tag-reducer";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";

export const loader = async ({request}: LoaderArgs) => {
  const url = new URL(request.url)
  const videoDataPath = url.searchParams.get("dir") || `${VIDEO_DATA_PATH}/pending`
  const pendingDir = await readdir(`${videoDataPath}`, {
    withFileTypes: true
  });

  function determineViewFromFilename(fileName: string) {
    return fileName.startsWith("source01") ? "SIDE" : "TOP";
  }

  const files: FileToTag[] = await Promise.all(pendingDir
    .filter(file => file.name.endsWith(".mp4"))
    .map(async file => {
      const tagData = await readTag(`${file.path}/${file.name}`);
      return {
        fileName: file.name,
        path: `video-data/pending/${file.name}`,
        date: tagData.date,
        flyers: tagData.artist || "David F/David W/Karen/Nick",
        formations: tagData.title?.startsWith('Power Punch') ? '' : tagData.title || '',
        view: tagData.comment || determineViewFromFilename(file.name)
      };
    })
  );

  return json({
    filesToTag: files.reduce((acc, curr) => ({
      ...acc,
      [curr.fileName]: curr
    }), {})
  });
};

export const action = async ({ request }: ActionArgs) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  const url = new URL(request.url)
  const videoDataPath = url.searchParams.get("dir") || `${VIDEO_DATA_PATH}/pending`

  const formData = await request.json();
  for (const fileToTag of formData.filesToTag) {
    await writeTag(`${videoDataPath}/${fileToTag.fileName}`, {
      title: fileToTag.formations || '',
      artist: fileToTag.flyers || '',
      date: fileToTag.date || '',
      comment: fileToTag.view || ''
    });
  }

  return null;
};

export default function TagDir() {
  const loaderData = useLoaderData<typeof loader>();
  const initialState: TagState = {
    filesToTag: loaderData.filesToTag,
    showModal: false,
  };
  const [{ showModal, videoPreviewPath, filesToTag, submissionState }, dispatch] = useReducer(tagReducer, initialState);

  function submitForm() {
    dispatch({type: 'setSubmissionState', value: 'submitting'})
    fetch('', {
      method: 'POST',
      body: JSON.stringify({ filesToTag: Object.values(filesToTag) }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        window.scrollTo(0, 0)
        dispatch({type: 'setSubmissionState', value: 'success'})
      } else {
        dispatch({type: 'setSubmissionState', value: 'error'})
      }
    })
  }

  return (
    <div>
      {submissionState === 'success' &&
        <div role="alert" className="alert alert-success">
          <SuccessIcon />
          <span>Tags saved</span>
        </div>
      }
      {
        submissionState === "error" &&
        <div role="alert" className="alert alert-error">
          <ErrorIcon />
          <span>Error saving tags</span>
        </div>
      }
      <div>
        <label>Set Date:<input type="date" className="input input-bordered ml-3" onChange={e => dispatch({
          type: "setOverrideDate",
          value: e.currentTarget.value
        })} /></label>
      </div>
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
        {Object.values(filesToTag).map((fileToTag, idx) =>
          <tr key={idx}>
            <td>{fileToTag.fileName}<input type="hidden" value={fileToTag.fileName} readOnly /></td>
            <td>
              <div className="join">
                <input type="date"
                       className="input input-bordered join-item tag-date"
                       value={fileToTag.date}
                       onChange={(e) => dispatch({
                         type: 'formElementChange',
                         fileName: fileToTag.fileName,
                         field: 'date',
                         value: e.currentTarget.value
                       })} />
              </div>
            </td>
            <td>
              <input type="text" className="input input-bordered"
                     value={fileToTag.flyers}
                     onChange={(e) => dispatch({
                       type: 'formElementChange',
                       fileName: fileToTag.fileName,
                       field: 'flyers',
                       value: e.currentTarget.value
                     })} />
            </td>
            <td><input type="text" pattern="[A-HJ-Q0-9]+"
                       className="input input-bordered"
                       onChange={(e) => dispatch({
                         type: 'formElementChange',
                         fileName: fileToTag.fileName,
                         field: 'formations',
                         value: e.currentTarget.value
                       })}
                       value={fileToTag.formations} />
            </td>
            <td>
              <select className="select input-bordered"
                      onChange={(e) => dispatch({
                        type: 'formElementChange',
                        fileName: fileToTag.fileName,
                        field: 'view',
                        value: e.currentTarget.value
                      })}
                      value={fileToTag.view}
              >
                <option value="TOP">Top</option>
                <option value="SIDE">Side</option>
              </select>
            </td>
            <td>
              <button type="button" onClick={() => dispatch({ type: "openVideoPreview", value: fileToTag.path })}>
                <PlayIcon />
              </button>
              <button type="button" className="ml-3" onClick={() => dispatch({ type: "copy", value: fileToTag.fileName })}>
                <CloneIcon />
              </button>
            </td>
          </tr>
        )}
        </tbody>
      </table>

      {showModal &&
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{videoPreviewPath}</h3>
            <video src={videoPreviewPath} controls muted />
            <div className="modal-action">
              <button className="btn" type='button' onClick={() => dispatch({ type: 'closeVideoPreview' })}>Close
              </button>
            </div>
          </div>
        </dialog>
      }

      <button className="btn" type="button" onClick={() => submitForm()}>
        Save
        {submissionState === 'submitting' ? <span className="loading loading-spinner"></span> : null}
      </button>
      <a className="btn ml-3" href="/sync-db">Sync DB</a>
    </div>
  );
}
