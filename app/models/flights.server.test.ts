import { prisma } from "~/db.server";
import { createFlight, getByFormationId, getFlight, updateFlight } from "~/models/flights.server";
import { beforeEach, describe, expect, test } from "vitest";

describe('flights model', () => {
  beforeEach(async () => {
    await prisma.flightFormation.deleteMany()
    await prisma.flight.deleteMany()
    await prisma.session.deleteMany()
    await prisma.flyer.deleteMany()

    await prisma.flyer.createMany({
      data: [
        { name: 'David W' },
        { name: 'Nick' },
        { name: 'David F' },
        { name: 'Karen' },
      ]
    });
  });
  
  test('should get all flights with a given formation', async () => {
    const sessionId = await createSession()
    await prisma.flight.create({
      data: {
        sessionId: sessionId,
        videoUrl: '/video-data/2024-01-01/flight1.mp4',
        view: 'TOP',
        flyers: {
          connect: [{ name: 'David W' }, { name: 'Nick' }]
        },
        formations: {
          createMany: {
            data: [
              { formationId: 'B', order: 2 },
              { formationId: 'A', order: 1 }
            ]
          }
        }
      }
    });
    await prisma.flight.create({
      data: {
        sessionId: sessionId,
        videoUrl: '/video-data/2024-01-01/flight2.mp4',
        view: 'SIDE',
        flyers: {
          connect: [{ name: 'David F' }, { name: 'Karen' }]
        },
        formations: {
          createMany: {
            data: [
              { formationId: 'B', order: 2 },
              { formationId: 'C', order: 1 }
            ]
          }
        }
      }
    });
    await prisma.flight.create({
      data: {
        sessionId: sessionId,
        videoUrl: '/video-data/2024-01-01/flight2.mp4',
        view: 'SIDE',
        flyers: {
          connect: [{ name: 'David F' }, { name: 'Karen' }]
        },
        formations: {
          createMany: {
            data: [
              { formationId: 'D', order: 2 },
              { formationId: 'C', order: 1 }
            ]
          }
        }
      }
    });

    const actual = await getByFormationId('B');
    expect(actual).toHaveLength(2);
    expect(actual[0].session.id).toEqual(sessionId);
    expect(actual[0].videoUrl).toEqual('/video-data/2024-01-01/flight1.mp4')
    expect(actual[0].view).toEqual('TOP')
    expect(actual[0].flyers).toHaveLength(2)
    expect(actual[0].flyers[0].name).toEqual('David W')
    expect(actual[0].flyers[1].name).toEqual('Nick')
    expect(actual[0].formations).toHaveLength(2)
    expect(actual[0].formations[0].formationId).toEqual('A')
    expect(actual[0].formations[1].formationId).toEqual('B')

    expect(actual[1].videoUrl).toEqual('/video-data/2024-01-01/flight2.mp4')
    expect(actual[1].view).toEqual('SIDE')
    expect(actual[1].flyers).toHaveLength(2)
    expect(actual[1].flyers[0].name).toEqual('David F')
    expect(actual[1].flyers[1].name).toEqual('Karen')
    expect(actual[1].formations).toHaveLength(2)
    expect(actual[1].formations[0].formationId).toEqual('C')
    expect(actual[1].formations[1].formationId).toEqual('B')
  })

  test('should create a flight', async () => {
    const sessionId = await createSession()
    const created = await createFlight({
      sessionId: sessionId,
      formationIds: ['B', 'A'],
      flyers: ['David W', 'Nick'],
      videoUrl: '/video-data/2020-01-01/video.mp4',
      view: 'TOP',
    })

    const actual = await getFlight(created.id)
    expect(actual.sessionId).toEqual(sessionId)
    expect(actual.formations[0].formationId).toEqual('B')
    expect(actual.formations[1].formationId).toEqual('A')
    expect(actual.flyers[0].name).toEqual('David W')
    expect(actual.flyers[1].name).toEqual('Nick')
    expect(actual.videoUrl).toEqual('/video-data/2020-01-01/video.mp4')
    expect(actual.view).toEqual('TOP')
  })

  test('should update formations and flyers for flight when there is overlap', async () => {
    const sessionId = await createSession()

    const created = await createFlight({
      sessionId: sessionId,
      formationIds: ['B', 'A'],
      flyers: ['David W', 'Nick'],
      videoUrl: '/video-data/2020-01-01/video.mp4',
      view: 'TOP',
    })

    await updateFlight(created.id, ['B', 'C'], ['David W', 'Karen'])
    const updated = await getFlight(created.id)

    expect(updated.flyers).toHaveLength(2)
    expect(updated.flyers[0].name).toEqual('David W')
    expect(updated.flyers[1].name).toEqual('Karen')
    expect(updated.formations).toHaveLength(2)
    expect(updated.formations[0].formationId).toEqual('B')
    expect(updated.formations[1].formationId).toEqual('C')
  })

  test('should update formations and flyers for flight when there is no overlap', async () => {
    const sessionId = await createSession()

    const created = await createFlight({
      sessionId: sessionId,
      formationIds: ['B', 'A'],
      flyers: ['David W', 'Nick'],
      videoUrl: '/video-data/2020-01-01/video.mp4',
      view: 'TOP',
    })

    await updateFlight(created.id, ['C', 'D'], ['David F', 'Karen'])
    const updated = await getFlight(created.id)

    expect(updated.flyers).toHaveLength(2)
    expect(updated.flyers[0].name).toEqual('David F')
    expect(updated.flyers[1].name).toEqual('Karen')
    expect(updated.formations).toHaveLength(2)
    expect(updated.formations[0].formationId).toEqual('C')
    expect(updated.formations[1].formationId).toEqual('D')

    const flyers = await prisma.flyer.findMany()
    expect(flyers).toHaveLength(4)
  })

  async function createSession(): Promise<string> {
    const session = await prisma.session.create({
      data: {
        date: new Date('2024-01-01')
      }
    });

    return session.id
  }
});
