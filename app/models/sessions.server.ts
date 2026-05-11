import { Prisma } from 'prisma/generated/client';
import { prisma } from '~/db.server';
import type { SiteType } from '~/utils/site-utils';

export function getAllNonCompetitionSessionDates(siteType: SiteType) {
    return prisma.session.findMany({
        select: { id: true, date: true, name: true },
        where: { team: siteType, competitionId: null },
        orderBy: { date: Prisma.SortOrder.asc },
    });
}

const flightsInclude = {
    select: {
        id: true,
        flyers: true,
        formations: { orderBy: { order: Prisma.SortOrder.asc } },
        sideVideoUrl: true,
        topVideoUrl: true,
        scores: true,
    },
};

export function getSession(sessionId: string) {
    return prisma.session.findUnique({
        include: {
            flights: flightsInclude,
        },
        where: { id: sessionId },
    });
}

export function getLatestSession(siteType: SiteType) {
    return prisma.session.findFirst({
        where: {
            team: siteType,
        },
        orderBy: [
            {
                date: 'desc',
            },
        ],
        include: {
            flights: flightsInclude,
        },
    });
}

export async function getOrCreateSession(
    siteType: SiteType,
    date: Date,
    name: string | null,
) {
    const existingSession = await prisma.session.findFirst({
        where: { team: siteType, date, name },
    });

    if (!existingSession) {
        const session = await prisma.session.create({
            data: {
                team: siteType,
                date: date,
                name: name,
            },
        });
        return session.id;
    }

    return existingSession.id;
}

export async function updateSession(data: {
    id: string;
    name: string;
    date: Date;
}) {
    await prisma.session.update({
        where: {
            id: data.id,
        },
        data: {
            name: data.name,
            date: data.date,
        },
    });
}
