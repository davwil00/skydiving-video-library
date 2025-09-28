import { data, redirect, useLoaderData } from 'react-router';
import { readdir } from 'fs/promises';
import { VIDEO_DATA_PATH } from '~/routes/sync-db';
import { determineViewFromFilename, extractIdFromFileName, readTag, writeTag } from '~/utils/tagUtils';
import { ErrorIcon, PlayIcon, SuccessIcon } from '~/components/icons';
import { useReducer } from 'react';
import { type FileToTag, tagReducer, type TagState } from '~/state/tag-reducer';
import type { Route } from './+types/tag';

export const loader = async () => {
    const videoDataPath = `${VIDEO_DATA_PATH}/pending`
    const pendingDir = await readdir(`${videoDataPath}`, {
        withFileTypes: true
    });

    const filesToTag = new Map<string, FileToTag>

    for (const file of pendingDir) {
        if (file.name.endsWith('.mp4')) {
            const id = extractIdFromFileName(file.name);
            const viewProp = determineViewFromFilename(file.name) === 'SIDE' ? 'sideVideo' : 'topVideo'
            if (filesToTag.has(id)) {
                const existing = filesToTag.get(id)!;
                existing[`${viewProp}FileName`] = file.name
                existing[`${viewProp}Path`] = `video-data/pending/${file.name}`
            } else {
                const tagData = await readTag(`${file.parentPath}/${file.name}`);
                filesToTag.set(id, {
                    id,
                    [`${viewProp}FileName`]: file.name,
                    [`${viewProp}Path`]: `video-data/pending/${file.name}`,
                    date: tagData.date,
                    flyers: tagData.artist || 'David F/Karen/David W/Nick',
                    formations: tagData.title?.startsWith('Power Punch') ? '' : tagData.title || '',
                })
            }
        }
    }

    return ({filesToTag});
};

export const action = async ({request}: Route.ActionArgs) => {
    if (request.method !== 'POST') {
        return data({message: 'Method not allowed', status: 405});
    }

    const url = new URL(request.url)
    const videoDataPath = url.searchParams.get('dir') || `${VIDEO_DATA_PATH}/pending`

    const formData: { filesToTag: FileToTag[] } = await request.json();
    try {
        for (const fileToTag of formData.filesToTag) {
            if (fileToTag.sideVideoFileName) {
                await writeTag(`${videoDataPath}/${fileToTag.sideVideoFileName}`, {
                    title: fileToTag.formations || '',
                    artist: fileToTag.flyers || '',
                    date: fileToTag.date || '',
                    comment: determineViewFromFilename(fileToTag.sideVideoFileName)
                });
            }
            if (fileToTag.topVideoFileName) {
                await writeTag(`${videoDataPath}/${fileToTag.topVideoFileName}`, {
                    title: fileToTag.formations || '',
                    artist: fileToTag.flyers || '',
                    date: fileToTag.date || '',
                    comment: determineViewFromFilename(fileToTag.topVideoFileName)
                });
            }
        }
    } catch (error) {
        console.error(error);
        return data({message: error, status: 500});
    }

    return redirect('/sync-db');
};

export default function TagDir() {
    const loaderData = useLoaderData<typeof loader>();
    const initialState: TagState = {
        filesToTag: loaderData.filesToTag,
        showModal: false,
    };
    const [{showModal, videoPreviewPath, filesToTag, submissionState}, dispatch] = useReducer(tagReducer, initialState);

    function submitForm() {
        const missingDates = Array.from(filesToTag.values()).some(file => file.date === '' || !file.date)
        if (missingDates) {
            dispatch({type: 'setSubmissionState', value: 'error'})
            return false;
        }

        dispatch({type: 'setSubmissionState', value: 'submitting'})
        fetch('', {
            method: 'POST',
            body: JSON.stringify({filesToTag: Array.from(filesToTag.values())}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                if (response.redirected) {
                    window.location.href = response.url
                } else {
                    window.scrollTo(0, 0)
                    dispatch({type: 'setSubmissionState', value: 'success'})
                }
            } else {
                dispatch({type: 'setSubmissionState', value: 'error'})
            }
        })
    }

    function row(fileToTag: FileToTag, idx: number) {
        return (
            <tr key={idx}>
                <td>{fileToTag.id}</td>
                <td>
                    <div className="join">
                        <input type="date"
                               className="input input-bordered join-item tag-date"
                               value={fileToTag.date}
                               onChange={(e) => dispatch({
                                   type: 'formElementChange',
                                   id: fileToTag.id,
                                   field: 'date',
                                   value: e.currentTarget.value
                               })}/>
                    </div>
                </td>
                <td>
                    <input type="text" className="input input-bordered"
                           value={fileToTag.flyers}
                           onChange={(e) => dispatch({
                               type: 'formElementChange',
                               id: fileToTag.id,
                               field: 'flyers',
                               value: e.currentTarget.value
                           })}
                    />
                </td>
                <td>
                    <input type="text" pattern="[A-HJ-Q0-9]+"
                           className="input input-bordered"
                           onChange={(e) => dispatch({
                               type: 'formElementChange',
                               id: fileToTag.id,
                               field: 'formations',
                               value: e.currentTarget.value
                           })}
                           value={fileToTag.formations}
                    />
                </td>
                <td>
                    <div className="flex gap-2">
                    {fileToTag.sideVideoPath ?
                        <button type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => dispatch({type: 'openVideoPreview', value: fileToTag.sideVideoPath!})}>
                            Side <PlayIcon/>
                        </button>
                        : null}
                    {fileToTag.topVideoPath ?
                        <button type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => dispatch({type: 'openVideoPreview', value: fileToTag.topVideoPath!})}>
                            Top <PlayIcon/>
                        </button>
                        : null}
                    </div>
                </td>
            </tr>
        )
    }

    return (
        <div className="form-light">
            {submissionState === 'success' &&
                <div role="alert" className="alert alert-success mb-4">
                    <SuccessIcon/>
                    <span>Tags saved</span>
                </div>
            }
            {
                submissionState === 'error' &&
                <div role="alert" className="alert alert-error mb-4">
                    <ErrorIcon/>
                    <span>Error saving tags</span>
                </div>
            }
            <div>
                <label>Set Date:<input type="date" className="input input-bordered ml-3" onChange={e => dispatch({
                    type: 'setOverrideDate',
                    value: e.currentTarget.value
                })}/></label>
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
                {Array.from(filesToTag.values()).map(row)}
                </tbody>
            </table>

            {showModal &&
                <dialog className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">{videoPreviewPath}</h3>
                        <video src={videoPreviewPath} controls muted/>
                        <div className="modal-action">
                            <button className="btn" type="button"
                                    onClick={() => dispatch({type: 'closeVideoPreview'})}>Close
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
