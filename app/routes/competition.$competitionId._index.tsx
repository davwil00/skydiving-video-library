import { useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';
import FlightCard from '~/components/flight-card';
import { EditIcon } from '~/components/icons';
import { getCompetition } from '~/models/competitions.server';
import { isLocalRequest } from '~/utils/localGuardUtils';
import { formatDate } from '~/utils/utils';
import type { Route } from '../../.react-router/types/app/routes/+types/competition.$competitionId._index';

export async function loader({ request, params }: Route.LoaderArgs) {
    const competition = await getCompetition(params.competitionId);
    invariant(competition, 'Competition not found');
    const isLocal = isLocalRequest(request);
    return { competition, isLocal };
}

export default function Competition() {
    const { competition, isLocal } = useLoaderData<typeof loader>();
    return (
        <div>
            <h1 className="text-2xl text-black flex items-center gap-2">
                <span>
                    {competition.name} {formatDate(competition.startDate)} -{' '}
                    {formatDate(competition.endDate)}
                </span>
                {isLocal ? (
                    <a href={`/competition/${competition.id}/edit`}>
                        <EditIcon height={20} />
                    </a>
                ) : null}
            </h1>
            <div className="mt-6">
                {competition.sessions.map((session) => (
                    <div key={`session-${session.id}`}>
                        <h2 className="text-xl flex items-center gap-2">
                            <span>{session.name ?? ''}</span>
                            <span>{formatDate(session.date)}</span>
                            {isLocal ? (
                                <a href={`/session/${session.id}/edit`}>
                                    <EditIcon height={20} />
                                </a>
                            ) : null}
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {session.flights.map((flight) => (
                                <FlightCard
                                    key={flight.id}
                                    flight={flight}
                                    session={session}
                                    showDate={false}
                                    isLocal={isLocal}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
