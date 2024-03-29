import { prisma } from "~/db.server";

export function getByFormationLetter(letter: string) {
  return prisma.flight.findMany({
    where: {
      formations: {
        some: {
          formationLetter: letter,
        },
      },
    },
    include: {
      session: true,
      flyers: true,
      formations: true,
      blocks: true
    },
  });
}

export function getByBlockId(id: number) {
  return prisma.flight.findMany({
    where: {
      blocks: {
        some: {
          id: id
        }
      }
    },
    include: {
      session: true,
      flyers: true,
      formations: true,
      blocks: true
    }
  })
}

export async function createFlight(flight: FlightCreateInput) {
  return prisma.flight.create({
    data: {
      sessionId: flight.sessionId,
      formations: {
        create: flight.formations.map((formation, idx) => (
          {
            order: idx,
            formation: {
              connect: { letter: formation }
            }
          }
        ))
      },
      blocks: {
        connect: flight.blocks.map((block) => ({ id: block })),
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
  formations: string[];
  blocks: number[];
  flyers: string[];
  videoUrl: string;
  view: string;
};
