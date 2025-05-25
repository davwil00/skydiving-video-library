import type { Route } from '../../.react-router/types/app/routes/+types/flight.$flightId._index';
import { isLocalRequest } from '~/utils/localGuardUtils';
import invariant from 'tiny-invariant';
import { getFlight } from '~/models/flights.server';
import { useLoaderData } from 'react-router';
import { formatDate } from '~/utils/utils';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CameraSwitchIcon, FullScreenIcon, PauseIcon, PlayIcon, PlaySpeedIcon } from '~/components/icons'
import { usePageStateDispatchContext } from '~/contexts/page-state'

export const loader = async ({request, params}: Route.LoaderArgs) => {
    if (!isLocalRequest(request)) {
        throw new Response('Forbidden', {status: 403});
    }

    invariant(params.flightId, 'flight not found');
    const flight = await getFlight(params.flightId);
    invariant(flight, 'Flight not found');
    // Find video with the other view
    let topSource, bottomSource;
    if (flight.view === 'SIDE') {
        topSource = flight.videoUrl;
        bottomSource = flight.videoUrl.replace('source01', 'source02')
    } else {
        topSource = flight.videoUrl.replace('source02', 'source01');
        bottomSource = flight.videoUrl;
    }
    return {date: flight.session.date, topSource, bottomSource, formations: flight.formations.join(',')};
};

export default function ViewFlight() {
    const {date, topSource, bottomSource, formations} = useLoaderData<typeof loader>();
    const topVideo = useRef<HTMLVideoElement>(null);
    const bottomVideo = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [time, setTime] = useState(0);

    const toggleView = () => {
        if (topVideo.current && bottomVideo.current) {
            topVideo.current.classList.toggle('hidden');
            bottomVideo.current.classList.toggle('hidden');
        }
    };

    const playPause = async () => {
        if (topVideo.current && bottomVideo.current) {
            if (isPlaying) {
                topVideo.current.pause();
                bottomVideo.current.pause();
                setIsPlaying(false);
            } else {
                await Promise.all([topVideo.current.play(), bottomVideo.current.play()])
                setIsPlaying(true);
            }
        }
    }

    const dispatch = usePageStateDispatchContext()

    const toggleFullScreen = () => {
        if (isFullScreen) {
            dispatch({type: 'setFullScreen', value: false})
            setIsFullScreen(false)
        } else {
            dispatch({type: 'setFullScreen', value: true})
            setIsFullScreen(true)
        }
    }

    const changeSpeed = (e: ChangeEvent<HTMLInputElement>) => {
        const speed = parseFloat(e.target.value);
        setSpeed(speed);
        if (topVideo.current && bottomVideo.current) {
            topVideo.current.playbackRate = speed;
            bottomVideo.current.playbackRate = speed;
        }
    };

    const changeTime = (e: ChangeEvent<HTMLInputElement>) => {
        const timePercent = parseFloat(e.target.value)
        const newTime = (timePercent / 100) * topVideo.current!.duration;
        if (topVideo.current && bottomVideo.current) {
            topVideo.current.currentTime = newTime;
            bottomVideo.current.currentTime = newTime;
            setTime(timePercent);
        }
    }

    useEffect(() => {
        topVideo.current?.addEventListener('timeupdate', () => {
            const newTime = (topVideo.current!.currentTime / topVideo.current!.duration) * 100
            setTime(newTime);
        })
        topVideo.current?.addEventListener('ended', () => {
            setIsPlaying(false)
        })
    }, [topVideo]);

    return (
        <div>
            {!isFullScreen ? <h1>{formatDate(date)} - {formations}</h1> : null}
            <figure className="flex">
                <video muted={true} preload="auto" ref={topVideo}>
                    <source src={topSource}/>
                </video>
                <video muted={true} preload="auto" className="hidden" ref={bottomVideo}>
                    <source src={`${bottomSource}`}/>
                </video>
                <div className="w-[50px] flex flex-col pt-4 relative right-[50px]">
                    <PlaySpeedIcon height="30" fill="#f9ffff"/>
                    <input type="range"
                           min={0}
                           max="2"
                           value={speed}
                           step="0.1"
                           className="w-40 -rotate-90 origin-left relative top-[160px] right-[-25px] range
                           [--range-fill:0] text-base-content [--range-bg:var(--color-primary)] [--size-selector:3px]"
                           onChange={changeSpeed}/>
                </div>
            </figure>
            <div className="mt-2 flex items-center gap-2">
                <button onClick={playPause} className="btn btn-primary">
                    {isPlaying ? <PauseIcon/> : <PlayIcon/>}
                </button>
                <button onClick={toggleView} className="btn btn-primary"><CameraSwitchIcon/></button>
                <input type="range" min={0} max={100} value={time} step="any" onChange={changeTime} className="grow range [--range-bg:var(--color-primary)] [--range-fill:0] text-base-content" />
                <button onClick={toggleFullScreen} className="btn btn-primary"><FullScreenIcon/></button>
            </div>
        </div>
    )
}
