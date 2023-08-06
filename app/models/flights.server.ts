import { prisma } from "~/db.server";

export function getByFormationLetter(letter: string) {
  return prisma.flight.findMany({
    where: {
      formations: {
        some: {
          letter: letter,
        },
      },
    },
    include: {
      session: true,
      flyers: true,
      formations: true,
    },
  });
}

export async function createFlight(flight: FlightCreateInput) {
  return prisma.flight.create({
    data: {
      sessionId: flight.sessionId,
      formations: {
        connect: flight.formations.map((formation) => ({ letter: formation })),
      },
      flyers: {
        connect: flight.flyers.map((flyer) => ({ name: flyer })),
      },
      videoUrl: flight.videoUrl,
    },
  });
}

export type FlightCreateInput = {
  sessionId: string;
  formations: string[];
  flyers: string[];
  videoUrl: string;
};
