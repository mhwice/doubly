import { Redis } from "@upstash/redis";
import { z } from "zod";

const redis = Redis.fromEnv();

function shortCodeKey(code: string) {
  return `short:${code}`;
}

export async function cacheLink(code: string, originalUrl: string, linkId: number): Promise<void> {
  await redis.hset(shortCodeKey(code), { originalUrl, linkId });
}

const CacheSchema = z.object({
  originalUrl: z.string(),
  linkId: z.coerce.number()
})

export async function getLink(code: string): Promise<{ originalUrl: string; linkId: number } | null> {
  const data = await redis.hgetall(shortCodeKey(code));
  if (!data) return null;
  const validated = CacheSchema.safeParse(data);
  if (!validated.success) return null;
  return { originalUrl: validated.data.originalUrl, linkId: validated.data.linkId };
}

