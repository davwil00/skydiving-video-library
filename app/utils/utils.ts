import { type Formation, type Random, isRandom } from "~/data/formations";

export function getFormationImageUrl(formation: Formation): string {
  if (isRandom(formation)) {
    return getRandomImageUrl(formation)
  } else {
    return getBlockImageUrl(formation.id)
  }
}

export function getRandomImageUrl(random: Random) {
  return `/images/randoms/${random.id}-${random.name.replace(" ", "-")}.png`.toLowerCase()
}

export function getBlockImageUrl(blockId: number): string {
  return `/images/blocks/${blockId}.png`
}
