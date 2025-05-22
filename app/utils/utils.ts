import { type Formation, type Random, isRandom } from "~/data/formations";
import { format } from "date-fns";

export function getFormationImageUrl(formation: Formation): string {
  if (isRandom(formation)) {
    return getRandomImageUrl(formation);
  } else {
    return getBlockImageUrl(formation.id);
  }
}

export function getRandomImageUrl(random: Random) {
  return `/images/randoms/${random.id}-${random.name.replace(" ", "-")}.png`.toLowerCase();
}

export function getBlockImageUrl(blockId: number): string {
  return `/images/blocks/${blockId}.png`;
}

export function capitalise(string: string): string {
  return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
}

// From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#answer-25984542
export function shuffle<T>(a: T[], b?: number, c?: number, d?: T) {
  c = a.length;
  while (c) {
    b = Math.random() * (--c + 1) | 0;
    d = a[c];
    a[c] = a[b];
    a[b] = d;
  }
}

export function formatDate(date: Date | null): string {
  if (!date) {
    return "Unknown";
  }
  try {
    return format(new Date(date), "dd-MM-yyyy");
  } catch (error) {
    return "";
  }
}
