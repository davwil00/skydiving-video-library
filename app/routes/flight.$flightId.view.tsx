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
    return {
        date: flight.session.date,
        topVideoUrl: flight.topVideoUrl,
        sideVideoUrl: flight.sideVideoUrl,
        formations: flight.formations.map(formation => formation.formationId).join(','),
        canToggle: !!flight.sideVideoUrl && !!flight.topVideoUrl
    };
};

export default function ViewFlight() {
    const {date, topVideoUrl, sideVideoUrl, formations, canToggle} = useLoaderData<typeof loader>();
    const topVideo = useRef<HTMLVideoElement>(null);
    const sideVideo = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [time, setTime] = useState(0);

    const toggleView = () => {
        if (topVideo.current && sideVideo.current) {
            topVideo.current.classList.toggle('hidden');
            sideVideo.current.classList.toggle('hidden');
        }
    };

    const playPause = async () => {
        if (isPlaying) {
            setIsPlaying(false);
            topVideo.current?.pause();
            sideVideo.current?.pause();
        } else {
            setIsPlaying(true);
            await Promise.all([topVideo.current?.play(), sideVideo.current?.play()]).catch()
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
        if (topVideo.current && sideVideo.current) {
            topVideo.current.playbackRate = speed;
            sideVideo.current.playbackRate = speed;
        }
    };

    const changeTime = (e: ChangeEvent<HTMLInputElement>) => {
        const timePercent = parseFloat(e.target.value)
        const newTime = (timePercent / 100) * topVideo.current!.duration;
        if (topVideo.current && sideVideo.current) {
            topVideo.current.currentTime = newTime;
            sideVideo.current.currentTime = newTime;
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
                    <source src={`${topVideoUrl}`}/>
                </video>
                <video muted={true} preload="auto" className="hidden" ref={sideVideo}>
                    <source src={`${sideVideoUrl}`}/>
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
                {canToggle ? <button onClick={toggleView} className="btn btn-primary"><CameraSwitchIcon/></button> : null}
                <input type="range" min={0} max={100} value={time} step="any" onChange={changeTime} className="grow range [--range-bg:var(--color-primary)] [--range-fill:0] text-base-content" />
                <button onClick={toggleFullScreen} className="btn btn-primary"><FullScreenIcon/></button>
            </div>
        </div>
    )
}
