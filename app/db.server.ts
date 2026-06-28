import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from 'prisma/generated/client';

import { singleton } from './singleton.server';

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL,
});

export const prisma = singleton('prisma', () => {
    const client = new PrismaClient({
        adapter,
    });
    client.$executeRaw`PRAGMA foreign_keys = ON;`;
    return client;
});
