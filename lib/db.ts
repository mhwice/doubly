import { PrismaClient } from "@prisma/client";

/*

we are doing this extra work instead of:

export const db = new PrismaClient();

for the dev env. In dev, if we dont do the extra config, then
Next.js hot-reload won't work properly. The extra config will create a
Prisma client once and on subsequent reloads we grab from globalThis which
does not get reset on each reload.

*/

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
