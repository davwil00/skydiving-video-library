import { prisma } from '~/db.server';

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
            formations: true
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
            videoUrl: flight.videoUrl,
            view: flight.view
        }
    });
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
                        order: idx,
                    },
                    create: {
                        order: idx,
                        formationId: formationId
                    }
                }))
            },
            flyers: {
                deleteMany: {
                    name: {notIn: flyers}
                },
                upsert: flyers.map((flyer) => ({
                    where: {
                        name: flyer
                    },
                    update: {
                        name: flyer
                    },
                    create: {
                        name: flyer
                    }
                }))
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
            formations: true
        }
    });
}

export type FlightCreateInput = {
    sessionId: string;
    formationIds: string[];
    flyers: string[];
    videoUrl: string;
    view: string;
};
