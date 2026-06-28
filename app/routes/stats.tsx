import type { MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';
import { type FormationStats, getSiteStats } from '~/models/stats.server';
import { getSiteType } from '~/utils/site-utils';
import type { Route } from './+types/stats';

export const meta: MetaFunction = () => [{ title: 'Stats' }];

export async function loader({ request }: Route.LoaderArgs) {
    const siteType = getSiteType(request);
    const stats = await getSiteStats(siteType);
    return { stats };
}

export default function StatsRoute() {
    const { stats } = useLoaderData<typeof loader>();

    const formationCountTable = (counts: FormationStats[], title: string) => {
        return (
            <div className="overflow-x-auto rounded-box border w-full xs:w-fit h-fit">
                <table className="table mixed table-zebra">
                    <thead>
                        <tr>
                            <th className="text-center" colSpan={3}>
                                {title}
                            </th>
                        </tr>
                        <tr className="bg-base-200">
                            <th>Formation</th>
                            <th>Times flown</th>
                        </tr>
                    </thead>
                    <tbody>
                        {counts.map((formation) => (
                            <tr key={formation.formation.id}>
                                <td className="text-left">
                                    {formation.formation.id}
                                </td>
                                <td className="text-right">
                                    {formation.count}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6 flex flex-col">
            <h1 className="text-3xl text-black">Stats</h1>

            <section className="stats stats-horizontal shadow">
                <div className="stat place-items-center">
                    <div className="stat-title text-primary-content">
                        Total sessions
                    </div>
                    <div className="stat-value text-primary text-wrap">
                        {stats.totalSessions}
                    </div>
                </div>
                <div className="stat place-items-center">
                    <div className="stat-title text-primary-content text-wrap">
                        Most practiced random
                    </div>
                    <div className="stat-value text-primary">
                        {stats.randomCounts[0].formation.id}
                    </div>
                </div>
                <div className="stat place-items-center">
                    <div className="stat-title text-primary-content text-wrap">
                        Most practiced block
                    </div>
                    <div className="stat-value text-primary">
                        {stats.aBlockCounts[0].formation.id}
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl text-black mb-2">Flights per person</h2>
                <div className="overflow-x-auto rounded-box border w-fit">
                    <table className="table mixed table-zebra">
                        <thead>
                            <tr className="bg-base-200">
                                <th className=""></th>
                                <th className="text-right">Flights</th>
                                <th className="text-right">
                                    Total time flown (ish)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.flightsPerPerson.map((person) => (
                                <tr key={person.name}>
                                    <th className="">{person.name}</th>
                                    <td className="text-right">
                                        {person.flightCount}
                                    </td>
                                    <td className="text-right">
                                        {person.totalFlightTime}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 className="text-2xl text-black mb-2">Formation counts</h2>
                <div className="flex gap-8 flex-wrap">
                    {formationCountTable(stats.randomCounts, 'Randoms')}
                    {formationCountTable(stats.aBlockCounts, 'A Blocks')}
                    {formationCountTable(stats.aaBlockCounts, 'AA Blocks')}
                    {formationCountTable(stats.aaaBlockCounts, 'AAA Blocks')}
                </div>
            </section>
        </div>
    );
}
