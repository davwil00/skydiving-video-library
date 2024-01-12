import { Form, useLoaderData } from "@remix-run/react";
import { readdir } from "fs/promises";
import { VIDEO_DATA_PATH } from "~/routes/sync-db";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { readTag, writeTag } from "~/utils/tagUtils";
import { ErrorIcon, PlayIcon, SuccessIcon } from "~/components/icons";
import { useReducer } from "react";

export const loader = async () => {
  const pendingDir = await readdir(`${VIDEO_DATA_PATH}/pending`, {
    withFileTypes: true
  });

  const files: FileToTag[] = await Promise.all(pendingDir
    .filter(file => file.name.endsWith(".mp4") || file.name.endsWith(".av1"))
    .map(async file => {
      const tagData = await readTag(`${VIDEO_DATA_PATH}/pending/${file.name}`);
      return {
        fileName: file.name,
        path: `${VIDEO_DATA_PATH}/pending/${file.name}`,
        date: tagData.date,
        flyers: tagData.artist,
        formations: tagData.title?.startsWith('Power Punch') ? '' : tagData.title,
        view: tagData.comment
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

  const formData = await request.json();
  for (const fileToTag of formData.filesToTag) {
    await writeTag(`${VIDEO_DATA_PATH}/pending/${fileToTag.fileName}`, {
      title: fileToTag.formations || '',
      artist: fileToTag.flyers || '',
      date: fileToTag.date || '',
      comment: fileToTag.view || ''
    });
  }

  return null;
};

type FileToTag = {
  fileName: string
  path: string
  date?: string
  flyers?: string
  formations?: string
  view?: string
}

type Action =
  | { type: "formElementChange", fileName: string, field: keyof FileToTag, value: string }
  | { type: "openVideoPreview", value: string }
  | { type: "closeVideoPreview" }
  | { type: "setOverrideDate", value: string }
  | { type: "setSubmissionState", value?: 'success' | 'error' }

type State = {
  videoPreviewPath?: string
  filesToTag: { [fileName: string]: FileToTag }
  showModal: boolean
  submissionState?: 'success' | 'error'
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "formElementChange":
      return {
        ...state,
        filesToTag: {
          ...state.filesToTag,
          [action.fileName]: {
            ...state.filesToTag[action.fileName],
            [action.field]: action.value
          }
        }
      };
    case "openVideoPreview":
      return {
        ...state,
        showModal: true,
        videoPreviewPath: action.value
      };
    case "closeVideoPreview":
      return {
        ...state,
        showModal: false
      };
    case "setOverrideDate":
      const newState = {...state}
      Object.keys(state.filesToTag).forEach(fileName => newState.filesToTag[fileName].date = action.value)
      return newState
    case 'setSubmissionState':
      return {
        ...state,
        submissionState: action.value
      }
    default:
      return state;
  }
};


export default function Tag() {
  const loaderData = useLoaderData<typeof loader>();
  const initialState: State = {
    filesToTag: loaderData.filesToTag,
    showModal: false
  };
  const [{ showModal, videoPreviewPath, filesToTag, submissionState }, dispatch] = useReducer(reducer, initialState);

  function determineViewFromFilename(fileName: string) {
    return fileName.startsWith("source01") ? "SIDE" : "TOP";
  }

  function submitForm() {
    dispatch({type: 'setSubmissionState', value: undefined})
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
    <Form method={"POST"}>
      {submissionState === 'success' &&
        <div role="alert" className="alert alert-success">
          <SuccessIcon/>
          <span>Tags saved</span>
        </div>
      }
      {
        submissionState === "error" &&
        <div role="alert" className="alert alert-error">
          <ErrorIcon/>
          <span>Error saving tags</span>
        </div>
      }
      <div>
        <label>Set Date:<input type="date" className="input input-bordered" onChange={e => dispatch({
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
                       })}/>
              </div>
            </td>
            <td>
              <input type="text" className="input input-bordered"
                     defaultValue={"David F/David W/Karen/Nick"}
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
                      defaultValue={determineViewFromFilename(fileToTag.fileName)}
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
              <button type="button" onClick={() => dispatch({type: 'openVideoPreview', value: fileToTag.path})}><PlayIcon /></button>
            </td>
          </tr>
        )}
        </tbody>
      </table>

      {showModal &&
        <dialog className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{videoPreviewPath}</h3>
            <video src={videoPreviewPath} controls />
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      }

      <button className="btn" type="button" onClick={() => submitForm()}>Save</button>
    </Form>
  );
}
