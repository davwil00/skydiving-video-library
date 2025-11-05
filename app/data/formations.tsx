import { shuffle } from "@vitest/utils";

export const RANDOMS: Random[] = [
  { id: "A", name: "Unipod" },
  { id: "B", name: "Stairstep Diamond" },
  { id: "C", name: "Murphy Flake" },
  { id: "D", name: "Yuan" },
  { id: "E", name: "Meeker" },
  { id: "F", name: "Open Accordian" },
  { id: "G", name: "Cataccord" },
  { id: "H", name: "Bow" },
  { id: "J", name: "Donut" },
  { id: "K", name: "Hook" },
  { id: "L", name: "Adder" },
  { id: "M", name: "Star" },
  { id: "N", name: "Crank" },
  { id: "O", name: "Satellite" },
  { id: "P", name: "Sidebody" },
  { id: "Q", name: "Phalanx" }
];

export const A_BLOCKS: Block[] = [
  { id: 2, startFormation: "Sidebody Donut", endFormation: "Side Flake Donut" },
  { id: 4, startFormation: "Monopod", endFormation: "Monopod" },
  { id: 6, startFormation: "Stardian", endFormation: "Stardian" },
  { id: 7, startFormation: "Sidebuddies", endFormation: "Sidebuddies" },
  { id: 8, startFormation: "Canadian Tree", endFormation: "Canadian Tree" },
  { id: 9, startFormation: "Cat + Accordian", endFormation: "Cat + Accordian" },
  { id: 19, startFormation: "Ritz", endFormation: "Icepick" },
  { id: 21, startFormation: "Zig Zag", endFormation: "Marquis" },
]

const AA_BLOCKS: Block[] = [
  { id: 1, startFormation: "Molar", endFormation: "Molar" },
  { id: 3, startFormation: "Side Flake Opal", endFormation: "Turf" },
  { id: 5, startFormation: "Opal", endFormation: "Opal" },
  { id: 10, startFormation: "Diamond", endFormation: "Bunyip" },
  { id: 11, startFormation: "Photon", endFormation: "Photon" },
  { id: 12, startFormation: "Bundy", endFormation: "Bundy" },
  { id: 13, startFormation: "Mixed Accordions", endFormation: "Mixed Accordions" },
  { id: 14, startFormation: "Bipole", endFormation: "Bipole" },
  { id: 15, startFormation: "Caterpillar", endFormation: "Caterpillar" },
  { id: 16, startFormation: "Compressed", endFormation: "Box" },
  { id: 17, startFormation: "Danish Tree", endFormation: "Murphy" },
  { id: 18, startFormation: "Ziroon", endFormation: "Ziroon" },
  { id: 20, startFormation: "Zipper", endFormation: "Zipper" },
  { id: 22, startFormation: "Tee", endFormation: "Chinese Tee" }
]

export const EIGHT_WAY_BLOCKS: Block[] = [
    { id: 1, startFormation: "Donut Flake", endFormation: "Donut Flake" },
    { id: 2, startFormation: "Swiss Bear", endFormation: "Swiss Bear" },
    { id: 3, startFormation: "Double Chinese Tees", endFormation: "Double Donuts" },
    { id: 4, startFormation: "Snowflake", endFormation: "In-Out" },
    { id: 5, startFormation: "Opposed Crank", endFormation: "Opposed Crank" },
    { id: 6, startFormation: "Star", endFormation: "Star" },
    { id: 7, startFormation: "Nacho", endFormation: "Nacho" },
    { id: 8, startFormation: "Frisbee", endFormation: "Frisbee" },
    { id: 9, startFormation: "Taj", endFormation: "Mahal" },
    { id: 10, startFormation: "Donut", endFormation: "Donut" },
    { id: 11, startFormation: "Norwegian Box", endFormation: "Norwegian Donut" },
    { id: 12, startFormation: "Stereo Bipoles", endFormation: "Stereo Bipoles" },
    { id: 13, startFormation: "Double Satellite", endFormation: "Double Satellite" },
    { id: 14, startFormation: "Zippered Opals", endFormation: "Zippered Opals" },
    { id: 15, startFormation: "Zippers", endFormation: "Double Yuans" },
    { id: 16, startFormation: "Canadian Tees", endFormation: "Monopods" },
    { id: 17, startFormation: "Buzzard", endFormation: "Buzzard" },
    { id: 18, startFormation: "Sidebody Donut", endFormation: "Sidebody Donut" },
    { id: 19, startFormation: "Compressed Diamonds", endFormation: "Compressed Diamonds" },
    { id: 20, startFormation: "Donut Cross", endFormation: "Donut Cross" },
    { id: 21, startFormation: "Free Bear", endFormation: "Eye" },
    { id: 22, startFormation: "Old Bone", endFormation: "Compressed Stairstep Diamonds" }
]

export const EIGHT_WAY_RANDOMS: Random[] = [
    { id: "A", name: "Caterpillar" },
    { id: "B", name: "Stairstep" },
    { id: "C", name: "Hourglass" },
    { id: "D", name: "Hope Diamond" },
    { id: "E", name: "Rubik" },
    { id: "F", name: "Diamond Flake" },
    { id: "G", name: "Arrowhead" },
    { id: "H", name: "Irquois" },
    { id: "J", name: "Springbok" },
    { id: "K", name: "Double Meekers" },
    { id: "L", name: "Open Facing Diamond" },
    { id: "M", name: "Double Spiders" },
    { id: "N", name: "Zipper Flake" },
    { id: "O", name: "Compressed Accordion" },
    { id: "P", name: "Venus" },
    { id: "Q", name: "Compass" }
]

export type Random = { id: string, name: string}
export type Block = { id: number, startFormation: string, endFormation: string }
export type Formation = Random | Block
export const FORMATIONS = [...RANDOMS, ...A_BLOCKS, ...AA_BLOCKS].reduce((acc, curr)  => ({
  ...acc,
  [curr.id]: curr
}), {} as {[id: string]: Formation})
export const EIGHT_WAY_FORMATIONS = [...EIGHT_WAY_RANDOMS, ...EIGHT_WAY_BLOCKS].reduce((acc, curr)  => ({
  ...acc,
  [curr.id]: curr
}), {} as {[id: string]: Formation})

export function isRandom(formation: Formation): formation is Random {
  return (formation as Random).name !== undefined
}

export function isBlock(formation: Formation): formation is Block {
  return (formation as Block).startFormation !== undefined
}

export const getDisplayName = (formation: Formation) => {
  if (isRandom(formation)) {
    return formation.name
  } else if (isBlock(formation)) {
    return `${formation.startFormation} > ${formation.endFormation}`
  }
}

export function generateRandomDive(seed?: number): string[] {
  const pool = shuffle([...RANDOMS, ...A_BLOCKS], seed)
  let points = 0
  const dive = []
  while (points < 3) {
    const formation = pool.pop()!;
    points += (RANDOMS as Array<unknown>).includes(formation) ? 1: 2
    dive.push(`${formation.id}`)
  }

  return dive
}
