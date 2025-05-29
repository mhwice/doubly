import { Redis } from "@upstash/redis";

/**
 * Takes a click event and writes it to the Upstash Redis Stream to be consumed later
 */

interface PayloadProps {
  linkId: number,
  createdAt: Date,
  source: string;
  city: string;
  continent: string;
  country: string;
  latitude: number | undefined;
  longitude: number | undefined;
  region: string;
  browser: string;
  os: string;
  device: string;
}

const redis = Redis.fromEnv();

export async function writeToStream(payload: PayloadProps) {

  const events: Record<string, string> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (v === undefined) continue;
    if (v instanceof Date) {
      events[k] = v.toISOString();
    } else {
      events[k] = String(v);
    }
  }

  await redis.xadd('click_events', '*', events);
}

