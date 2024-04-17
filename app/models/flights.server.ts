import { prisma } from "~/db.server";

export function getByFormationId(formationId: string) {
  return prisma.flight.findMany({
    where: {
      formations: {
        some: {
          formationId: formationId,
        },
      },
    },
    include: {
      session: true,
      flyers: true,
      formations: true,
    },
    orderBy: {
      session: {
        date: 'desc'
      }
    }
  });
}

export async function createFlight(flight: FlightCreateInput) {
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
        connect: flight.flyers.map((flyer) => ({ name: flyer })),
      },
      videoUrl: flight.videoUrl,
      view: flight.view
    },
  });
}

export type FlightCreateInput = {
  sessionId: string;
  formationIds: string[];
  flyers: string[];
  videoUrl: string;
  view: string;
};
