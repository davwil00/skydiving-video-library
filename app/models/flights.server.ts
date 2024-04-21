import { prisma } from "~/db.server";
import { Prisma } from ".prisma/client";
import FlightUpdateInput = Prisma.FlightUpdateInput;

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
        date: "desc"
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
        connect: flight.flyers.map((flyer) => ({ name: flyer }))
      },
      videoUrl: flight.videoUrl,
      view: flight.view
    }
  });
}

export async function updateFlight(flightId: string, formationIds: string[], flyers: string[]) {
  await prisma.$transaction([
    prisma.flight.update({
      where: {
        id: flightId
      },
      data: {
        formations: {
          deleteMany: {},
          create: formationIds.map((formationId, idx) => (
            {
              order: idx,
              formationId: formationId
            }
          ))
        },
        flyers: {
          deleteMany: {},
          connect: flyers.map((flyer) => ({ name: flyer }))
        }
      }
    }),
  ])
}

export function getFlight(flightId: string) {
  return prisma.flight.findUnique({
    where: { id: flightId },
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
