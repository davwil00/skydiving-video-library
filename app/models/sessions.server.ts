import { prisma } from "~/db.server";

export function getAllSessionDates() {
  return prisma.session.findMany({
    select: { id: true, date: true },
  });
}

export function getSession(sessionId: string) {
  return prisma.session.findUnique({
    include: {
      flights: { select: { flyers: true, formations: true, videoUrl: true } },
    },
    where: { id: sessionId },
  });
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
