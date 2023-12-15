import { prisma } from "~/db.server";

export function getAllSessionDates() {
  return prisma.session.findMany({
    select: { id: true, date: true },
  });
}

const flightsInclude = { select: { flyers: true, formations: true, blocks: true, videoUrl: true } };

export function getSession(sessionId: string) {
  return prisma.session.findUnique({
    include: {
      flights: flightsInclude,
    },
    where: { id: sessionId },
  });
}

export function getLatestSession() {
  return prisma.session.findFirst(
    {
      orderBy: [{
        date: "desc"
      }],
      include: {
        flights: flightsInclude
      }
    }
  )
}

export async function getOrCreateSession(date: Date) {
  const existingSession = await prisma.session.findFirst({
    where: { date: date },
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
