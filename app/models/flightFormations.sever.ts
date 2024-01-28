import { prisma } from "~/db.server";

export function createFlightFormation(videoUrl: string, formations: string[]) {
    const flight = prisma.flight.findUnique({
        where: {
            videoUrl: videoUrl
        }
    })
    
    formations.forEach((letter, order) => prisma.flightFormation.create({
        data: {
            flightId: flight.id,
            formationLetter: letter,
            order: order
        }
    }))
}