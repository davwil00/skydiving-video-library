import { prisma } from "~/db.server";

export function getBlock(id: number) {
  return prisma.blocks.findUnique({
    where: { id: id },
  });
}
