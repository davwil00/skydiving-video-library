import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  // cleanup the existing database
  await prisma.formation.delete({ where: {} }).catch(() => {
    // no worries if it doesn't exist yet
  });

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
    { letter: "Q", name: "Phalanx" },
  ];

  for (const { letter, name } of formations) {
    await prisma.formation.create({
      data: {
        letter: letter,
        name: name,
      },
    });
  }

  for (const flyer of [
    "David F",
    "David W",
    "Nick",
    "Karen",
    "Lawrence",
    "Cath",
  ]) {
    await prisma.flyer.create({
      data: {
        name: flyer,
      },
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
