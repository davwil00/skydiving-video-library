import { prisma } from "~/db.server";
import { Prisma } from "@prisma/client";

export function getAllSoloSessions() {
  return prisma.soloSession.findMany({
    orderBy: {
      date: "desc"
    }
  });
}

export function getSoloSession(id: string) {
  return prisma.soloSession.findUnique({
    include: {
      flights: {
        select: {
          id: true,
          videoUrl: true
        }
      }
    },
    where: { id } }
  );
}

export function createSoloSession(data: Prisma.SoloSessionCreateInput) {
  return prisma.soloSession.create({ data });
}
