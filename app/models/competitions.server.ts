import { prisma } from '~/db.server';
import { Prisma } from '@prisma/client'

export function getAllCompetitions() {
    return prisma.competition.findMany({
        orderBy: {
            startDate: 'asc'
        }
    });
}

export function getCompetition(id: string) {
    return prisma.competition.findUnique({
            include: {
                sessions: {
                    select: {
                        id: true,
                        date: true,
                        name: true,
                        flights: {
                            include: {
                                flyers: true,
                                formations: {orderBy: {order: Prisma.SortOrder.asc}},
                                scores: true
                            }
                        },
                    }
                }
            },
            where: {id}
        }
    );
}

export type CreateUpdateCompetitionData = {
    startDate: Date;
    endDate: Date;
    name: string;
    location: string;
    rank: number | null;
    sessionIds: string[]
}

export function createCompetition(data: CreateUpdateCompetitionData) {
    return prisma.competition.create({
        data: {
            startDate: data.startDate,
            endDate: data.endDate,
            name: data.name,
            location: data.location,
            rank: data.rank,
            sessions: {
                connect: data.sessionIds.map(id => ({id}))
            }
        }
    });
}

export function updateCompetition(competitionId: string, data: CreateUpdateCompetitionData) {
    return prisma.competition.update({
        data: {
            startDate: data.startDate,
            endDate: data.endDate,
            name: data.name,
            location: data.location,
            sessions: {
                connect: data.sessionIds.map(id => ({id}))
            }
        },
        where: {
            id: competitionId
        }
    });
}
