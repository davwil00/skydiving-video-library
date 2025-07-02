import { getSoloSession } from '~/models/solo-sessions.server';
import invariant from 'tiny-invariant';
import { useLoaderData } from 'react-router';
import type { Route } from './+types/solo.$id';
import { formatDate } from '~/utils/utils';
import { isLocalRequest } from '~/utils/localGuardUtils';

export const loader = async ({request, params}: Route.LoaderArgs) => {
    invariant(params.id, 'id not found');
    const session = await getSoloSession(params.id);
    const isLocal = isLocalRequest(request)
    if (!session) {
        throw new Response('Not Found', {status: 404});
    }
    return {session, isLocal};
};

export default function SoloView() {
    const {session, isLocal} = useLoaderData<typeof loader>();

    function video(flight: {id: string, videoUrl: string}) {
        const videoUrl = isLocal ? flight.videoUrl : `https://d3sblpf3xfzlw7.cloudfront.net/${flight.videoUrl?.substring(20)}`
        return (<video key={flight.id} src={videoUrl} controls muted className="w-[calc(50%-10px)]"/>)
    }

    return (
        <div>
            <h1 className="text-2xl">{formatDate(session.date)}</h1>
            <p>Duration: {session.duration} minutes</p>
            <p>Skills: {session.skills}</p>
            <p>Notes: {session.notes}</p>

            <div className="flex flex-wrap gap-4">
                {session.flights.map((flight) => video(flight))}
            </div>
        </div>
    )
}
