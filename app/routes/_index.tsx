import { format } from 'date-fns';
import type { MetaFunction } from 'react-router';
import { Link, useLoaderData } from 'react-router';
import FlightCard from '~/components/flight-card';
import { useSiteStateContext } from '~/contexts/site-state';
import { generateRandomDive } from '~/data/formations';
import { getLatestSession } from '~/models/sessions.server';
import { isLocalRequest } from '~/utils/localGuardUtils';
import { SiteType } from '~/utils/site-utils';
import type { Route } from './+types/_index';

export const meta: MetaFunction = () => [
    { title: 'Chocolate Chip Cookies Video Library' },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
    const latestSession = await getLatestSession();
    const isLocal = isLocalRequest(request);
    const seed = parseInt(format(new Date(), 'yyyyMMdd'), 10);
    const diveOfTheDay = generateRandomDive(seed);
    return { latestSession, isLocal, diveOfTheDay };
};

export default function Index() {
    const { latestSession, isLocal, diveOfTheDay } =
        useLoaderData<typeof loader>();
    const { siteType } = useSiteStateContext();

    const diveLinks = diveOfTheDay.map((formation) => (
        <Link
            key={formation}
            to={`${siteType === SiteType.TUNNEL_VISION ? '/8-way' : ''}/formation/${formation}`}
            className="pr-2 underline"
        >
            {formation}
        </Link>
    ));

    if (siteType === SiteType.TUNNEL_VISION) {
        return (
            <div className="mx-auto w-fit">
                <img
                    src={'images/logos/tunnel-vision.jpeg'}
                    alt="Tunnel Vision"
                    className="mb-4"
                />
                <div className="text-black text-3xl mb-3">
                    Dive of the day - {diveLinks}
                </div>
                <ul>
                    <a className="btn" href="/quiz">
                        Quiz
                    </a>
                </ul>
            </div>
        );
    }
    if (!latestSession) {
        return null;
    }

    return (
        <>
            <div className="text-black text-3xl mb-3">
                Dive of the day - {diveLinks}
            </div>
            <h2 className="text-black text-3xl">
                Latest session -{' '}
                {format(new Date(latestSession.date), 'do MMMM')}
            </h2>
            <div className="flex flex-wrap justify-center">
                {latestSession.flights.map((flight) => (
                    <FlightCard
                        key={flight.id}
                        flight={flight}
                        session={latestSession}
                        showDate={false}
                        isLocal={isLocal}
                    />
                ))}
            </div>
        </>
    );
}
