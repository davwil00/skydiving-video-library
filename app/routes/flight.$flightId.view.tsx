import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';
import {
    CameraSwitchIcon,
    FullScreenIcon,
    PauseIcon,
    PlayIcon,
    PlaySpeedIcon,
} from '~/components/icons';
import { usePageStateDispatchContext } from '~/contexts/page-state';
import { getFlight } from '~/models/flights.server';
import { addNote } from '~/models/notes.server';
import { isLocalRequest } from '~/utils/localGuardUtils';
import { formatDate, getVideoUrl } from '~/utils/utils';
import type { Route } from '../../.react-router/types/app/routes/+types/flight.$flightId._index';
import type { Note } from '../../prisma/generated/client';
import {getSiteType} from "~/utils/site-utils";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    invariant(params.flightId, 'flight not found');
    const flight = await getFlight(params.flightId, true);
    invariant(flight, 'Flight not found');
    const isLocal = isLocalRequest(request);
    const siteType = getSiteType(request);

    return {
        date: flight.session.date,
        topVideoUrl: getVideoUrl(flight.topVideoUrl, isLocal, siteType),
        sideVideoUrl: getVideoUrl(flight.sideVideoUrl, isLocal, siteType),
        formations: flight.formations
            .map((formation) => formation.formationId)
            .join(','),
        canToggle: !!flight.sideVideoUrl && !!flight.topVideoUrl,
        notes: flight.notes,
    };
};

export const action = async ({ request, params }: Route.LoaderArgs) => {
    const data = await request.formData();
    const note = data.get('note') as string;
    const addedBy = data.get('addedBy') as string;
    const flightId = params.flightId;

    if (!note || !addedBy) {
        return;
    }

    await addNote({
        note: note,
        addedBy: addedBy,
        dateAdded: new Date(),
        flightId,
    });
};

function NoteSection({ note }: { note: Note }) {
    return (
        <div className="border-2 p-4 rounded-md mb-4 w-fit">
            <p>{note.note}</p>
            <small>{note.addedBy}</small> -
            <small>{formatDate(note.dateAdded)}</small>
        </div>
    );
}

export default function ViewFlight() {
    const { date, topVideoUrl, sideVideoUrl, formations, canToggle, notes } =
        useLoaderData<typeof loader>();
    const topVideo = useRef<HTMLVideoElement>(null);
    const sideVideo = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [time, setTime] = useState(0);
    const [showAddNote, setShowAddNote] = useState(false);
    const [showVideoControls, setShowVideoControls] = useState(false);

    const toggleView = () => {
        if (topVideo.current && sideVideo.current) {
            topVideo.current.classList.toggle('hidden');
            sideVideo.current.classList.toggle('hidden');
        }
    };

    const playPause = async () => {
        if (isPlaying) {
            topVideo.current?.pause();
            sideVideo.current?.pause();
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            await Promise.all([
                topVideo.current?.play(),
                sideVideo.current?.play(),
            ]).catch();
        }
    };

    const dispatch = usePageStateDispatchContext();

    const toggleFullScreen = () => {
        if (isFullScreen) {
            dispatch({ type: 'setFullScreen', value: false });
            setIsFullScreen(false);
        } else {
            dispatch({ type: 'setFullScreen', value: true });
            setIsFullScreen(true);
        }
    };

    const changeSpeed = (e: ChangeEvent<HTMLInputElement>) => {
        const speed = parseFloat(e.target.value);
        setSpeed(speed);
        if (topVideo.current && sideVideo.current) {
            topVideo.current.playbackRate = speed;
            sideVideo.current.playbackRate = speed;
        }
    };

    const changeTime = (e: ChangeEvent<HTMLInputElement>) => {
        const timePercent = parseFloat(e.target.value);
        if (topVideo.current && sideVideo.current) {
            const newTime = (timePercent / 100) * topVideo.current.duration;
            topVideo.current.currentTime = newTime;
            sideVideo.current.currentTime = newTime;
            setTime(timePercent);
        }
    };

    useEffect(() => {
        topVideo.current?.addEventListener('timeupdate', () => {
            if (topVideo.current) {
                const newTime =
                    (topVideo.current.currentTime / topVideo.current.duration) *
                    100;
                setTime(newTime);
            }
        });
        topVideo.current?.addEventListener('ended', () => {
            setIsPlaying(false);
        });
        topVideo.current?.addEventListener('loadedmetadata', () => {
            setShowVideoControls(true);
        });
    }, []);

    const VideoControls = () => {
        if (!showVideoControls) {
            return null;
        }
        return (
            <div className="mt-2 flex items-center gap-2">
                <button
                    onClick={playPause}
                    className="btn btn-primary"
                    type="button"
                >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                {canToggle ? (
                    <button
                        onClick={toggleView}
                        className="btn btn-primary"
                        type="button"
                    >
                        <CameraSwitchIcon />
                    </button>
                ) : null}
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={time}
                    step="any"
                    onChange={changeTime}
                    className="grow range [--range-bg:var(--color-primary)] [--range-fill:0] text-base-content"
                />
                <button
                    onClick={toggleFullScreen}
                    className="btn btn-primary"
                    type="button"
                >
                    <FullScreenIcon />
                </button>
            </div>
        );
    };

    const SpeedControls = () => {
        if (!showVideoControls) {
            return null;
        }
        return (
            <div className="w-12.5 flex flex-col pt-4 relative right-12.5">
                <PlaySpeedIcon height="30" fill="#f9ffff" />
                <input
                    type="range"
                    min={0}
                    max="2"
                    value={speed}
                    step="0.1"
                    className="w-40 -rotate-90 origin-left relative top-40 -right-6.25 range
                           [--range-fill:0] text-base-content [--range-bg:var(--color-primary)] [--size-selector:3px]"
                    onChange={changeSpeed}
                />
            </div>
        );
    };

    return (
        <div>
            {!isFullScreen ? (
                <h1>
                    {formatDate(date)} - {formations}
                </h1>
            ) : null}
            <figure className="flex justify-center">
                {topVideoUrl ? (
                    <video muted={true} preload="auto" ref={topVideo}>
                        <source src={`${topVideoUrl}`} />
                    </video>
                ) : null}
                {sideVideoUrl ? (
                    <video
                        muted={true}
                        preload="auto"
                        className="hidden"
                        ref={sideVideo}
                    >
                        <source src={`${sideVideoUrl}`} />
                    </video>
                ) : null}
                <SpeedControls />
            </figure>
            <VideoControls />
            <div className="mt-4">
                <h2 className="text-2xl font-bold mb-4">Notes</h2>
                {notes.map((note) => (
                    <NoteSection key={note.id} note={note} />
                ))}
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                        setShowAddNote(true);
                    }}
                >
                    Add note
                </button>
            </div>
            {showAddNote && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-w-200">
                        <h3 className="font-bold text-lg text-white mb-4">
                            Add note
                        </h3>
                        <form className="flex flex-col gap-4" method="post">
                            <textarea
                                rows={5}
                                className="w-full border-primary border-2 rounded-md bg-white p-4"
                                name="note"
                            ></textarea>
                            <label className="text-white flex gap-4 items-center">
                                Your name
                                <input
                                    type="text"
                                    className="bg-white input text-black"
                                    name="addedBy"
                                />
                            </label>
                            <div className="modal-action gap-4 flex mt-0">
                                <button
                                    className="btn btn-neutral"
                                    type="button"
                                    onClick={() => {
                                        setShowAddNote(false);
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                >
                                    Add note
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}
        </div>
    );
}
