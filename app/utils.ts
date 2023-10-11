import { Formation } from "@prisma/client";

export function getFormationUrl(formation: Formation): string {
  return `/images/${formation.letter}-${formation.name.replace(" ", "-")}.png`.toLowerCase()
}
