import { prisma } from '~/db.server';
import { Prisma } from '@prisma/client';

export function getByFormationId(formationId: string) {
    return prisma.flight.findMany({
        where: {
            formations: {
                some: {
                    formationId: formationId
                }
            }
        },
        include: {
            session: true,
            flyers: true,
            formations: {orderBy: {order: 'asc'}},
            scores: true
        },
        orderBy: {
            session: {
                date: 'desc'
            }
        }
    });
}

export function createFlight(flight: FlightCreateInput) {
    return prisma.flight.create({
        data: {
            sessionId: flight.sessionId,
            formations: {
                create: flight.formationIds.map((formationId, idx) => (
                    {
                        order: idx,
                        formationId: formationId
                    }
                ))
            },
            flyers: {
                connect: flight.flyers.map((flyer) => ({name: flyer}))
            },
            sideVideoUrl: flight.sideVideoUrl,
            topVideoUrl: flight.topVideoUrl,
        }
    });
}

export type Score = {
    formation: string
    score: number,
    order: number,
}
export async function updateFlight(flightId: string, formationIds: string[], flyers: string[]) {
    await prisma.flight.update({
        where: {
            id: flightId
        },
        data: {
            formations: {
                deleteMany: {
                    formationId: {notIn: formationIds}
                },
                upsert: formationIds.map((formationId, idx) => ({
                    where: {
                        flightId_formationId_order: {
                            flightId: flightId,
                            formationId: formationId,
                            order: idx
                        }
                    },
                    update: {
                        order: idx
                    },
                    create: {
                        order: idx,
                        formationId: formationId
                    }
                }))
            },
            flyers: {
                set: [],
                connect: flyers.map((flyer) => ({name: flyer}))
            },
        }
    });
}

export async function updateFlightScores(flightId: string, scores: Score[]) {
    await prisma.flight.update({
        where: {
            id: flightId
        },
        data: {
            scores: {
                deleteMany: {
                    flightId: flightId
                },
                createMany: {
                    data: scores.map((score) => ({
                        formation: score.formation,
                        score: score.score,
                        order: score.order
                    }))
                }
            }
        }
    })
}

export function getFlight(flightId: string) {
    return prisma.flight.findUnique({
        where: {id: flightId},
        include: {
            session: true,
            flyers: true,
            formations: {orderBy: {order: 'asc'}},
            scores: true
        }
    });
}

export type FlightCreateInput = {
    sessionId: string;
    formationIds: string[];
    flyers: string[];
    sideVideoUrl?: string;
    topVideoUrl?: string;
};

export function findFlightsWithFormations(formations: string[]) {
    return prisma.flight.findMany({
        where: {
            AND: formations.map(formationId => ({
                formations: {
                    some: {
                        formationId: {
                            equals: formationId.toUpperCase()
                        }
                    }
                }
            })) as Prisma.FlightWhereInput[]
        },
        include: {
            session: true,
            flyers: true,
            formations: {orderBy: {order: 'asc'}},
            scores: true
        },
        orderBy: {
            session: {
                date: 'desc'
            }
        }
    });
}
