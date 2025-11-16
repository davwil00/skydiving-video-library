import { prisma } from '~/db.server';
import { Prisma } from '@prisma/client'

export function getAllSessionDates() {
    return prisma.session.findMany({
        select: {id: true, date: true, name: true},
    });
}

const flightsInclude = {
    select: {
        id: true,
        flyers: true,
        formations: {orderBy: {order: Prisma.SortOrder.asc}},
        sideVideoUrl: true,
        topVideoUrl: true,
        scores: true
    }
};

export function getSession(sessionId: string) {
    return prisma.session.findUnique({
        include: {
            flights: flightsInclude,
        },
        where: {id: sessionId},
    });
}

export function getLatestSession() {
    return prisma.session.findFirst(
        {
            orderBy: [{
                date: 'desc'
            }],
            include: {
                flights: flightsInclude
            }
        }
    )
}

export async function getOrCreateSession(date: Date) {
    const existingSession = await prisma.session.findFirst({
        where: {date: date},
    });

    if (!existingSession) {
        const session = await prisma.session.create({
            data: {
                date: date,
            },
        });
        return session.id;
    }

    return existingSession.id;
}

export async function updateSession(data: { id: string, name: string, date: Date }) {
    await prisma.session.update({
        where: {
            id: data.id
        },
        data: {
            name: data.name,
            date: data.date
        }
    })
}
