import { shuffle } from "@vitest/utils";

export enum Level { ROOKIE, A, AA, AAA, INTERMEDIATE, SENIOR}
export enum Discipline { FOUR_WAY, EIGHT_WAY}

export const RANDOMS: Random[] = [
  { id: "A", name: "Unipod" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "B", name: "Stairstep Diamond" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "C", name: "Murphy Flake" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "D", name: "Yuan" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "E", name: "Meeker" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "F", name: "Open Accordian" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "G", name: "Cataccord" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "H", name: "Bow" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "J", name: "Donut" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "K", name: "Hook" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "L", name: "Adder" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "M", name: "Star" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "N", name: "Crank" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "O", name: "Satellite" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "P", name: "Sidebody" , level: Level.ROOKIE, discipline: Discipline.FOUR_WAY},
  { id: "Q", name: "Phalanx", level: Level.ROOKIE, discipline: Discipline.FOUR_WAY }
];

export const A_BLOCKS: Block[] = [
  { id: '2', startFormation: "Sidebody Donut", endFormation: "Side Flake Donut", level: Level.A, discipline: Discipline.FOUR_WAY },
  { id: '4', startFormation: "Monopod", endFormation: "Monopod", level: Level.A, discipline: Discipline.FOUR_WAY },
  { id: '6', startFormation: "Stardian", endFormation: "Stardian", level: Level.A, discipline: Discipline.FOUR_WAY },
  { id: '7', startFormation: "Sidebuddies", endFormation: "Sidebuddies", level: Level.A, discipline: Discipline.FOUR_WAY },
  { id: '8', startFormation: "Canadian Tree", endFormation: "Canadian Tree", level: Level.A, discipline: Discipline.FOUR_WAY },
  { id: '9', startFormation: "Cat + Accordian", endFormation: "Cat + Accordian", level: Level.A, discipline: Discipline.FOUR_WAY },
  { id: '19', startFormation: "Ritz", endFormation: "Icepick", level: Level.A, discipline: Discipline.FOUR_WAY },
  { id: '21', startFormation: "Zig Zag", endFormation: "Marquis", level: Level.A, discipline: Discipline.FOUR_WAY },
]

export const AA_BLOCKS: Block[] = [
  { id: '1', startFormation: "Molar", endFormation: "Molar" , level: Level.AA, discipline: Discipline.FOUR_WAY },
  { id: '11', startFormation: "Photon", endFormation: "Photon" , level: Level.AA, discipline: Discipline.FOUR_WAY },
  { id: '13', startFormation: "Mixed Accordions", endFormation: "Mixed Accordions" , level: Level.AA, discipline: Discipline.FOUR_WAY },
  { id: '14', startFormation: "Bipole", endFormation: "Bipole" , level: Level.AA, discipline: Discipline.FOUR_WAY },
  { id: '15', startFormation: "Caterpillar", endFormation: "Caterpillar" , level: Level.AA, discipline: Discipline.FOUR_WAY },
  { id: '18', startFormation: "Ziroon", endFormation: "Ziroon" , level: Level.AA, discipline: Discipline.FOUR_WAY },
  { id: '20', startFormation: "Zipper", endFormation: "Zipper" , level: Level.AA, discipline: Discipline.FOUR_WAY },
  { id: '22', startFormation: "Tee", endFormation: "Chinese Tee", level: Level.AA, discipline: Discipline.FOUR_WAY },
]

export const AAA_BLOCKS: Block[] = [
  { id: '3', startFormation: "Side Flake Opal", endFormation: "Turf", level: Level.AAA, discipline: Discipline.FOUR_WAY },
  { id: '5', startFormation: "Opal", endFormation: "Opal", level: Level.AAA, discipline: Discipline.FOUR_WAY },
  { id: '10', startFormation: "Diamond", endFormation: "Bunyip", level: Level.AAA, discipline: Discipline.FOUR_WAY },
  { id: '12', startFormation: "Bundy", endFormation: "Bundy", level: Level.AAA, discipline: Discipline.FOUR_WAY },
  { id: '16', startFormation: "Compressed", endFormation: "Box", level: Level.AAA, discipline: Discipline.FOUR_WAY },
  { id: '17', startFormation: "Danish Tree", endFormation: "Murphy", level: Level.AAA, discipline: Discipline.FOUR_WAY },
]

export const EIGHT_WAY_BLOCKS: Block[] = [
    { id: '1', startFormation: "Donut Flake", endFormation: "Donut Flake" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '2', startFormation: "Swiss Bear", endFormation: "Swiss Bear" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '3', startFormation: "Double Chinese Tees", endFormation: "Double Donuts" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '4', startFormation: "Snowflake", endFormation: "In-Out" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '5', startFormation: "Opposed Crank", endFormation: "Opposed Crank" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '6', startFormation: "Star", endFormation: "Star" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '7', startFormation: "Nacho", endFormation: "Nacho" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '8', startFormation: "Frisbee", endFormation: "Frisbee" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '9', startFormation: "Taj", endFormation: "Mahal" , level: Level.SENIOR, discipline: Discipline.EIGHT_WAY},
    { id: '10', startFormation: "Donut", endFormation: "Donut" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '11', startFormation: "Norwegian Box", endFormation: "Norwegian Donut" , level: Level.SENIOR, discipline: Discipline.EIGHT_WAY},
    { id: '12', startFormation: "Stereo Bipoles", endFormation: "Stereo Bipoles" , level: Level.SENIOR, discipline: Discipline.EIGHT_WAY},
    { id: '13', startFormation: "Double Satellite", endFormation: "Double Satellite" , level: Level.SENIOR, discipline: Discipline.EIGHT_WAY},
    { id: '14', startFormation: "Zippered Opals", endFormation: "Zippered Opals" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '15', startFormation: "Zippers", endFormation: "Double Yuans" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '16', startFormation: "Canadian Tees", endFormation: "Monopods" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '17', startFormation: "Buzzard", endFormation: "Buzzard" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '18', startFormation: "Sidebody Donut", endFormation: "Sidebody Donut" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '19', startFormation: "Compressed Diamonds", endFormation: "Compressed Diamonds" , level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY},
    { id: '20', startFormation: "Donut Cross", endFormation: "Donut Cross" , level: Level.SENIOR, discipline: Discipline.EIGHT_WAY},
    { id: '21', startFormation: "Free Bear", endFormation: "Eye" , level: Level.SENIOR, discipline: Discipline.EIGHT_WAY},
    { id: '22', startFormation: "Old Bone", endFormation: "Compressed Stairstep Diamonds", level: Level.SENIOR , discipline: Discipline.EIGHT_WAY},
]

export const EIGHT_WAY_RANDOMS: Random[] = [
    { id: "A", name: "Caterpillar", level: Level.SENIOR, discipline: Discipline.EIGHT_WAY },
    { id: "B", name: "Stairstep", level: Level.SENIOR, discipline: Discipline.EIGHT_WAY },
    { id: "C", name: "Hourglass", level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY },
    { id: "D", name: "Hope Diamond", level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY },
    { id: "E", name: "Rubik", level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY },
    { id: "F", name: "Diamond Flake", level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY },
    { id: "G", name: "Arrowhead", level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY },
    { id: "H", name: "Irquois", level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY },
    { id: "J", name: "Springbok", level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY },
    { id: "K", name: "Double Meekers", level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY },
    { id: "L", name: "Open Facing Diamond", level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY },
    { id: "M", name: "Double Spiders", level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY },
    { id: "N", name: "Zipper Flake", level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY },
    { id: "O", name: "Compressed Accordion", level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY },
    { id: "P", name: "Venus", level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY },
    { id: "Q", name: "Compass", level: Level.INTERMEDIATE, discipline: Discipline.EIGHT_WAY },
]

export const allFormations = [
    ...RANDOMS,
    ...A_BLOCKS,
    ...AA_BLOCKS,
    ...AAA_BLOCKS,
    ...EIGHT_WAY_RANDOMS,
    ...EIGHT_WAY_BLOCKS
]

export interface Formation {
    id: string
    level: Level
    discipline: Discipline
}

export interface Random extends Formation {
    name: string
}

export interface Block extends Formation {
    startFormation: string
    endFormation: string
}

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
