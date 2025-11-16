import invariant from 'tiny-invariant';
import {getSession} from '~/models/sessions.server';
import {useLoaderData} from 'react-router';
import {format} from 'date-fns';
import FlightCard from '~/components/flight-card';
import {isLocalRequest} from '~/utils/localGuardUtils';
import type {Route} from './+types/session.$sessionId._index';

export const loader = async ({params, request}: Route.LoaderArgs) => {
    invariant(params.sessionId, "session not found");
    const isLocal = isLocalRequest(request)

    const session = await getSession(params.sessionId);
    if (!session) {
        throw new Response("Not Found", {status: 404});
    }
    return {session, isLocal};
};

export default function SessionDetailsPage() {
    const {session, isLocal} = useLoaderData<typeof loader>();

    return (
        <div>
            <h1 className="text-2xl text-black">
                {session.name ?? format(new Date(session.date), "do MMMM")}
            </h1>
            <div className="flex flex-wrap justify-center">
                {session.flights
                    .map((flight, idx) => (
                        <FlightCard
                            key={idx}
                            flight={flight}
                            session={session}
                            showDate={false}
                            isLocal={isLocal}
                        />
                    ))}
            </div>
        </div>
    );
}
