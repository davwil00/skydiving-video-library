import { prisma } from "~/db.server";

export function getFormation(letter: string) {
  return prisma.formation.findUnique({
    where: { letter: letter },
  });
}
