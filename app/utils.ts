import type { Formation } from "@prisma/client";

export function getFormationImageUrl(formation: Formation): string {
  return `/images/randoms/${formation.letter}-${formation.name.replace(" ", "-")}.png`.toLowerCase()
}

export function getBlockImageUrl(blockId: number): string {
  return `/images/blocks/${blockId}}.png`.toLowerCase()
}
