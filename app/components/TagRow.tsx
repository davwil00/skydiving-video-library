import { type Dispatch, use } from 'react';
import { PlayIcon, SuccessIcon } from '~/components/icons';
import type { FileToTag, TagAction } from '~/state/tag-reducer';

function isTagged(fileToTag: FileToTag, progressCompleted: string[]): boolean {
    const isSideTagged =
        !fileToTag.sideVideoFileName ||
        progressCompleted.includes(fileToTag.sideVideoFileName);
    const isTopTagged =
        !fileToTag.topVideoFileName ||
        progressCompleted.includes(fileToTag.topVideoFileName);
    return isSideTagged && isTopTagged;
}

export default function Row({
    fileToTagPromise,
    showFlyers,
    dispatch,
    filesToTag,
    submissionState,
    progressCompleted,
}: {
    fileToTagPromise: Promise<FileToTag>;
    showFlyers: boolean;
    dispatch: Dispatch<TagAction>;
    filesToTag: Map<string, FileToTag>;
    submissionState?: string;
    progressCompleted: string[];
}) {
    fileToTagPromise.then((fileToTag) => {
        dispatch({ type: 'trackFile', value: fileToTag });
    });
    const { id } = use(fileToTagPromise);
    const fileToTag = filesToTag.get(id);
    if (!fileToTag) {
        return null;
    }
    return (
        <tr>
            <td>{fileToTag.id}</td>
            <td>
                <div className="join">
                    <input
                        type="date"
                        className="input input-bordered join-item tag-date"
                        value={fileToTag.date}
                        onChange={(e) =>
                            dispatch({
                                type: 'formElementChange',
                                id: fileToTag.id,
                                field: 'date',
                                value: e.currentTarget.value,
                            })
                        }
                    />
                </div>
            </td>
            {showFlyers ? (
                <td>
                    <input
                        type="text"
                        className="input input-bordered"
                        value={fileToTag.flyers}
                        onChange={(e) =>
                            dispatch({
                                type: 'formElementChange',
                                id: fileToTag.id,
                                field: 'flyers',
                                value: e.currentTarget.value,
                            })
                        }
                    />
                </td>
            ) : null}
            <td>
                <input
                    type="text"
                    pattern="[A-HJ-Q0-9]+"
                    className="input input-bordered"
                    onChange={(e) =>
                        dispatch({
                            type: 'formElementChange',
                            id: fileToTag.id,
                            field: 'formations',
                            value: e.currentTarget.value,
                        })
                    }
                    value={fileToTag.formations}
                />
            </td>
            <td>
                <div className="flex gap-2">
                    {fileToTag.sideVideoPath ? (
                        <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                                dispatch({
                                    type: 'openVideoPreview',
                                    // biome-ignore lint/style/noNonNullAssertion: null checked above
                                    value: fileToTag.sideVideoPath!,
                                })
                            }
                        >
                            Side <PlayIcon />
                        </button>
                    ) : null}
                    {fileToTag.topVideoPath ? (
                        <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                                dispatch({
                                    type: 'openVideoPreview',
                                    // biome-ignore lint/style/noNonNullAssertion: null checked above
                                    value: fileToTag.topVideoPath!,
                                })
                            }
                        >
                            Top <PlayIcon />
                        </button>
                    ) : null}
                </div>
            </td>
            <td>
                {submissionState === 'submitting' ? (
                    isTagged(fileToTag, progressCompleted) ? (
                        <SuccessIcon />
                    ) : (
                        <span className="loading loading-spinner"></span>
                    )
                ) : null}
            </td>
        </tr>
    );
}
