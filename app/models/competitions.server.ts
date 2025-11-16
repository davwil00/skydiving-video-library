import { prisma } from "~/db.server";
import { Prisma } from "@prisma/client";

export function getAllCompetitions() {
  return prisma.competition.findMany({
    orderBy: {
      date: "asc"
    }
  });
}

export function getCompetition(id: string) {
  return prisma.competition.findUnique({
    include: {
      flights: {
        select: {
          id: true,
        }
      }
    },
    where: { id } }
  );
}

export function createCompetition(data: Prisma.CompetitionCreateInput) {
  return prisma.competition.create({ data });
}
