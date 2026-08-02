import { prisma } from '~/db.server'

async function main() {
    // cleanup the existing database
    await prisma.flyer.deleteMany().catch();

    for (const flyer of [
        'David F',
        'David W',
        'Nick',
        'Karen',
        'Lawrence',
        'Cath',
    ]) {
        await prisma.flyer.create({
            data: {
                name: flyer,
            },
        });
    }

    console.log(`Database has been seeded. 🌱`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
