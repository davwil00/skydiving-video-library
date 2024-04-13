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
  { id: 13, startFormation: "Offest", endFormation: "Spinner" },
  { id: 14, startFormation: "Bipole", endFormation: "Bipole" },
  { id: 15, startFormation: "Caterpillar", endFormation: "Caterpillar" },
  { id: 16, startFormation: "Compressed", endFormation: "Box" },
  { id: 17, startFormation: "Danish Tree", endFormation: "Murphy" },
  { id: 18, startFormation: "Ziroon", endFormation: "Ziroon" },
  { id: 20, startFormation: "Piver", endFormation: "Viper" },
  { id: 22, startFormation: "Tee", endFormation: "Chinese Tee" }
]

export type Random = { id: string, name: string}
export type Block = { id: number, startFormation: string, endFormation: string }
export type Formation = Random | Block
export const FORMATIONS = [...RANDOMS, ...A_BLOCKS, ...AA_BLOCKS].reduce((acc, curr)  => ({
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
    return `${formation.startFormation} &rarr; ${formation.endFormation}`
  }
}
