import { PrismaClient } from "prisma/generated/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { singleton } from "./singleton.server";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

export const prisma = singleton("prisma", () => new PrismaClient({
  adapter
}));