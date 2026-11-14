import { useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';
import FlightCard from '~/components/flight-card';
import { EditIcon } from '~/components/icons';
import { getCompetition } from '~/models/competitions.server';
import { isLocalRequest } from '~/utils/localGuardUtils';
import { formatDate } from '~/utils/utils';
import type { FlightFormation, Score } from '../../../prisma/generated/client';
import type { Route } from './+types/index';

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
                <Scorecard sessions={competition.sessions} />
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

type FlightWithScoresAndFormations = {
    scores: Score[];
    formations: FlightFormation[];
};
type SessionWithFlight = {
    flights: FlightWithScoresAndFormations[];
};

function Scorecard({ sessions }: { sessions: SessionWithFlight[] }) {
    const allFlights = sessions.flatMap((flight) => flight.flights);
    const scoresByRound = allFlights.reduce(
        (acc, flight: FlightWithScoresAndFormations, idx) => {
            const score = flight.scores.reduce(
                (total, score) => total + score.score,
                0,
            );
            const formations = flight.formations
                .map((formation) => formation.formationId)
                .join(', ');
            acc.set(idx, { score, formations });
            return acc;
        },
        new Map<number, { score: number; formations: string }>(),
    );
    const totalScore = Array.from(scoresByRound.values()).reduce(
        (total, score) => total + score.score,
        0,
    );
    const average = (totalScore / allFlights.length).toFixed(2);

    return (
        <table className="table table-auto border-collapse border mb-4 border-black">
            <thead>
                <tr className="border-black">
                    {Array.from(scoresByRound.entries()).map(
                        ([roundNumber, round]) => (
                            <th className="border">
                                {roundNumber + 1} - {round.formations}
                            </th>
                        ),
                    )}
                    <th className="border">Total</th>
                    <th className="border">Average</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-black">
                    {Array.from(scoresByRound.values()).map((round) => (
                        <td className="border">{round.score}</td>
                    ))}
                    <td className="border">{totalScore}</td>
                    <td className="border">{average}</td>
                </tr>
            </tbody>
        </table>
    );
}
