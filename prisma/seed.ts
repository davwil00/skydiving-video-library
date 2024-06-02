import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  // cleanup the existing database
  await prisma.formation.deleteMany().catch();
  await prisma.blocks.deleteMany().catch()
  await prisma.flyer.deleteMany().catch()

  const formations = [
    { letter: "A", name: "Unipod" },
    { letter: "B", name: "Stairstep Diamond" },
    { letter: "C", name: "Murphy Flake" },
    { letter: "D", name: "Yuan" },
    { letter: "E", name: "Meeker" },
    { letter: "F", name: "Open Accordian" },
    { letter: "G", name: "Cataccord" },
    { letter: "H", name: "Bow" },
    { letter: "J", name: "Donut" },
    { letter: "K", name: "Hook" },
    { letter: "L", name: "Adder" },
    { letter: "M", name: "Star" },
    { letter: "N", name: "Crank" },
    { letter: "O", name: "Satellite" },
    { letter: "P", name: "Sidebody" },
    { letter: "Q", name: "Phalanx" }
  ];

  for (const { letter, name } of formations) {
    await prisma.formation.create({
      data: {
        letter: letter,
        name: name
      }
    });
  }

  for (const flyer of [
    "David F",
    "David W",
    "Nick",
    "Karen",
    "Lawrence",
    "Cath"
  ]) {
    await prisma.flyer.create({
      data: {
        name: flyer
      }
    });
  }

  const blocks = [
    { id: 1, startFormation: "Molar", endFormation: "Molar" },
    { id: 2, startFormation: "Sidebody Donut", endFormation: "Side Flake Donut" },
    { id: 3, startFormation: "Side Flake Opal", endFormation: "Turf" },
    { id: 4, startFormation: "Monopod", endFormation: "Monopod" },
    { id: 5, startFormation: "Opal", endFormation: "Opal" },
    { id: 6, startFormation: "Stardian", endFormation: "Stardian" },
    { id: 7, startFormation: "Sidebuddies", endFormation: "Sidebuddies" },
    { id: 8, startFormation: "Canadian Tree", endFormation: "Canadian Tree" },
    { id: 9, startFormation: "Cat + Accordian", endFormation: "Cat + Accordian" },
    { id: 10, startFormation: "Diamond", endFormation: "Bunyip" },
    { id: 11, startFormation: "Photon", endFormation: "Photon" },
    { id: 12, startFormation: "Bundy", endFormation: "Bundy" },
    { id: 13, startFormation: "Offest", endFormation: "Spinner" },
    { id: 14, startFormation: "Bipole", endFormation: "Bipole" },
    { id: 15, startFormation: "Caterpillar", endFormation: "Caterpillar" },
    { id: 16, startFormation: "Compressed", endFormation: "Box" },
    { id: 17, startFormation: "Danish Tree", endFormation: "Murphy" },
    { id: 18, startFormation: "Ziroon", endFormation: "Ziroon" },
    { id: 19, startFormation: "Ritz", endFormation: "Icepick" },
    { id: 20, startFormation: "Piver", endFormation: "Viper" },
    { id: 21, startFormation: "Zig Zag", endFormation: "Marquis" },
    { id: 22, startFormation: "Tee", endFormation: "Chinese Tee" }
  ];

  for (const { id, startFormation, endFormation } of blocks) {
    await prisma.blocks.create({
      data: {
        id,
        startFormation,
        endFormation
      }
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
