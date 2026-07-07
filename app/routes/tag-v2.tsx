import { readdir } from 'node:fs/promises';
import { Suspense, useReducer } from 'react';
import { useLoaderData } from 'react-router';
import { ErrorIcon, SuccessIcon } from '~/components/icons';
import TagRow from '~/components/TagRow';
import type { TagProgressEvent } from '~/routes/async-tag';
import { VIDEO_DATA_PATH } from '~/routes/sync-db';
import { type FileToTag, type TagState, tagReducer } from '~/state/tag-reducer';
import { getSiteType, SiteType } from '~/utils/site-utils';
import {
    determineViewFromFilename,
    extractIdFromFileName,
    readTag,
} from '~/utils/tagUtils';

type FilesById = {
    id: string;
    sideVideoFileName?: string;
    sideVideoPath?: string;
    topVideoFileName?: string;
    topVideoPath?: string;
    fullFilePath: string;
};

type PromiseAndId = {
    id: string;
    promise: Promise<FileToTag>;
};

export const loader = async ({ request }: { request: Request }) => {
    const videoDataPath = `${VIDEO_DATA_PATH}/pending`;
    const pendingDir = await readdir(`${videoDataPath}`, {
        withFileTypes: true,
    });

    const showFlyers = getSiteType(request) === SiteType.COOKIES;

    const filesById = pendingDir
        .filter((file) => file.name.endsWith('.mp4'))
        .reduce(
            (groupedFiles, file) => {
                const id = extractIdFromFileName(file.name);
                const viewProp =
                    determineViewFromFilename(file.name) === 'SIDE'
                        ? 'sideVideo'
                        : 'topVideo';
                if (groupedFiles[id]) {
                    groupedFiles[id][`${viewProp}FileName`] = file.name;
                    groupedFiles[id][`${viewProp}Path`] =
                        `video-data/pending/${file.name}`;
                    return groupedFiles;
                } else {
                    return {
                        ...groupedFiles,
                        [id]: {
                            id,
                            [`${viewProp}FileName`]: file.name,
                            [`${viewProp}Path`]: `video-data/pending/${file.name}`,
                            fullFilePath: `${file.parentPath}/${file.name}`,
                        } as FilesById,
                    };
                }
            },
            {} as Record<string, FilesById>,
        );

    const filesToTag: Array<PromiseAndId> = Object.values(filesById).map(
        (file) => {
            const promise = readTag(file.fullFilePath).then(
                (tagData) =>
                    ({
                        id: file.id,
                        topVideoFileName: file.topVideoFileName,
                        topVideoPath: file.topVideoPath,
                        sideVideoFileName: file.sideVideoFileName,
                        sideVideoPath: file.sideVideoPath,
                        date: tagData.date,
                        flyers:
                            tagData.artist ||
                            (showFlyers ? 'David F/Karen/David W/Nick' : ''),
                        formations: tagData.title?.startsWith('Power Punch')
                            ? ''
                            : tagData.title || '',
                    }) as FileToTag,
            );
            return { promise, id: file.id };
        },
    );

    return { filesToTag, showFlyers };
};

export default function TagDir() {
    const { filesToTag, showFlyers } = useLoaderData<typeof loader>();
    const initialState: TagState = {
        progressCompleted: [],
        progressErrors: [],
        progressTotal: 0,
        filesToTag: new Map(),
        showModal: false,
    };
    const [state, dispatch] = useReducer(tagReducer, initialState);

    async function submitForm() {
        const yieldToBrowser = () =>
            new Promise<void>((resolve) =>
                window.requestAnimationFrame(() => resolve()),
            );

        const missingDates = Array.from(state.filesToTag.values()).some(
            (file) => file.date === '' || !file.date,
        );
        if (missingDates) {
            dispatch({ type: 'setSubmissionState', value: 'error' });
            return false;
        }

        dispatch({ type: 'setSubmissionState', value: 'submitting' });
        dispatch({ type: 'resetProgress' });

        try {
            const response = await fetch('async-tag', {
                method: 'POST',
                body: JSON.stringify({
                    filesToTag: Array.from(state.filesToTag.values()),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok || !response.body) {
                dispatch({ type: 'setSubmissionState', value: 'error' });
                return false;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let done = false;

            while (!done) {
                const chunk = await reader.read();
                done = chunk.done;
                if (chunk.value) {
                    buffer += decoder.decode(chunk.value, { stream: true });
                }

                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.trim()) {
                        continue;
                    }

                    const event = JSON.parse(line) as TagProgressEvent;
                    switch (event.type) {
                        case 'started':
                            dispatch({
                                type: 'setProgressStart',
                                total: event.total,
                            });
                            await yieldToBrowser();
                            break;
                        case 'progress':
                            dispatch({
                                type: 'setProgressUpdate',
                                completed: event.completed,
                                total: event.total,
                                currentFile: event.currentFile,
                            });
                            await yieldToBrowser();
                            break;
                        case 'error':
                            dispatch({
                                type: 'setProgressUpdate',
                                completed: event.completed,
                                total: event.total,
                                currentFile: event.currentFile,
                            });
                            dispatch({
                                type: 'addProgressError',
                                message: `${event.currentFile}: ${event.message}`,
                            });
                            await yieldToBrowser();
                            break;
                        case 'done':
                            dispatch({
                                type: 'setProgressDone',
                                completed: event.completed,
                                total: event.total,
                            });
                            dispatch({
                                type: 'setSubmissionState',
                                value: event.hasErrors ? 'error' : 'success',
                            });
                            await yieldToBrowser();
                            if (!event.hasErrors) {
                                window.location.href = '/sync-db';
                            }
                            break;
                    }
                }
            }
        } catch (error) {
            console.error(error);
            dispatch({ type: 'setSubmissionState', value: 'error' });
        }

        return true;
    }

    return (
        <div className="form-light">
            {state.submissionState === 'success' && (
                <div role="alert" className="alert alert-success mb-4">
                    <SuccessIcon />
                    <span>Tags saved</span>
                </div>
            )}
            {state.submissionState === 'error' && (
                <div role="alert" className="alert alert-error mb-4">
                    <ErrorIcon />
                    <span>Error saving tags</span>
                </div>
            )}
            <div>
                <label>
                    Set Date:
                    <input
                        type="date"
                        className="input input-bordered ml-3"
                        onChange={(e) =>
                            dispatch({
                                type: 'setOverrideDate',
                                value: e.currentTarget.value,
                            })
                        }
                    />
                </label>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>File</th>
                        <th>Date</th>
                        {showFlyers ? <th>Flyers</th> : null}
                        <th>Formations</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    {filesToTag.map(({ promise, id }) => (
                        <Suspense
                            key={id}
                            fallback={
                                <tr>
                                    <td colSpan={showFlyers ? 5 : 4}>
                                        Loading...
                                    </td>
                                </tr>
                            }
                        >
                            <TagRow
                                fileToTagPromise={promise}
                                showFlyers={showFlyers}
                                dispatch={dispatch}
                                filesToTag={state.filesToTag}
                                submissionState={state.submissionState}
                                progressCompleted={state.progressCompleted}
                            />
                        </Suspense>
                    ))}
                </tbody>
            </table>

            {state.showModal && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-w-full">
                        <h3 className="font-bold text-lg">
                            {state.videoPreviewPath}
                        </h3>
                        <video src={state.videoPreviewPath} controls muted />
                        <div className="modal-action">
                            <button
                                className="btn"
                                type="button"
                                onClick={() =>
                                    dispatch({ type: 'closeVideoPreview' })
                                }
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}

            <button className="btn" type="button" onClick={() => submitForm()}>
                Save
                {state.submissionState === 'submitting' ? (
                    <span className="loading loading-spinner"></span>
                ) : null}
            </button>
            <a className="btn ml-3" href="/sync-db">
                Sync DB
            </a>
        </div>
    );
}
