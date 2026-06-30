import { intervalToDuration } from 'date-fns';
import {
    type Formation,
    getAllFormations,
    type Level,
    Type,
} from '~/data/formations';
import { prisma } from '~/db.server';
import type { SiteType } from '~/utils/site-utils';

const FLIGHT_DURATION_SECONDS = 100;
const EXCLUDED_FLYERS = ['Huit is going on', 'Les Dragons en Chocolat'];

type StatsFlight = {
    flyers: { name: string }[];
    formations: { formationId: string }[];
};

export type PersonFlightStats = {
    name: string;
    flightCount: number;
    totalFlightTime: string;
};

export type FormationStat = {
    formation: Formation;
    count: number;
};

export type SiteStats = {
    totalSessions: number;
    flightsPerPerson: PersonFlightStats[];
    randomCounts: FormationStat[];
    blockCounts: Map<Level, FormationStat[]>;
};

function sortCountThenName<
    T extends string | object,
    U extends { count: number },
>(entries: [T, U['count']][]): [T, U['count']][] {
    return entries.sort((a, b) => {
        if (b[1] !== a[1]) {
            return b[1] - a[1];
        }
        return a[0].toString().localeCompare(b[0].toString());
    });
}

export function calculateSiteStats(
    totalSessions: number,
    flights: StatsFlight[],
    siteType: SiteType,
): SiteStats {
    const flightsByFlyer = new Map<string, number>();
    const formationCounts = new Map<Formation, number>();
    const allFormations = getAllFormations(siteType);

    for (const flight of flights) {
        flight.flyers
            .filter((flyer) => !EXCLUDED_FLYERS.includes(flyer.name))
            .forEach((flyer) => {
                flightsByFlyer.set(
                    flyer.name,
                    (flightsByFlyer.get(flyer.name) ?? 0) + 1,
                );
            });

        for (const formation of flight.formations) {
            const formationKey = allFormations[formation.formationId];
            formationCounts.set(
                formationKey,
                (formationCounts.get(formationKey) ?? 0) + 1,
            );
        }
    }

    const flightsPerPerson = sortCountThenName([
        ...flightsByFlyer.entries(),
    ]).map(([name, flightCount]) => {
        const flightTimeMs = flightCount * FLIGHT_DURATION_SECONDS * 1000;
        const flightTimeDuration = intervalToDuration({
            start: 0,
            end: flightTimeMs,
        });
        const totalFlightTime = `${(flightTimeDuration.days ?? 0) * 24 + (flightTimeDuration.hours ?? 0)}:${flightTimeDuration.minutes?.toString().padStart(2, '0')}`;
        return {
            name,
            flightCount,
            totalFlightTime,
        };
    });

    const sortedFormations: FormationStat[] = sortCountThenName([
        ...formationCounts.entries(),
    ]).map(([formation, count]) => ({ formation, count }));
    const randomCounts: FormationStat[] = [];
    const blockCounts = new Map<Level, FormationStat[]>();
    sortedFormations.forEach((formationStat) => {
        if (formationStat.formation?.type === Type.RANDOM) {
            randomCounts.push(formationStat);
        } else {
            if (!blockCounts.has(formationStat.formation.level)) {
                blockCounts.set(formationStat.formation.level, []);
            }
            blockCounts.get(formationStat.formation.level)?.push(formationStat);
        }
    });

    return {
        totalSessions,
        flightsPerPerson,
        randomCounts,
        blockCounts,
    };
}

export async function getSiteStats(siteType: SiteType): Promise<SiteStats> {
    const [totalSessions, flights] = await Promise.all([
        prisma.session.count({ where: { team: siteType } }),
        prisma.flight.findMany({
            where: {
                session: {
                    team: siteType,
                },
            },
            select: {
                flyers: {
                    select: {
                        name: true,
                    },
                },
                formations: {
                    select: {
                        formationId: true,
                    },
                },
            },
        }),
    ]);

    return calculateSiteStats(totalSessions, flights, siteType);
}
