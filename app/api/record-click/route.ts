/*

Consumes the queue events

*/

import { ClickEvents } from "@/data-access/clicks";
import { ClickRecord } from "@/lib/zod/clicks";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"

export const POST = verifySignatureAppRouter(async (req: Request) => {
  const body = await req.json();
  const validated = ClickRecord.safeParse(body);
  if (!validated.success) {
    console.error("[INVALID DATA]", body, validated.error);
    throw new Error("Invalid data");
  }

  // write to db
  const clickResponse = await ClickEvents.recordClickIfExists(validated.data);
  if (!clickResponse.success) throw new Error("Failed to record click to db");
  return Response.json({ success: true });
});

/*

Should validate with Zod.
then write to db.

body {
  code: 'abc123def456',
  source: 'link',
  city: 'Duncan',
  continent: 'North America',
  country: 'Canada',
  latitude: 48.7835,
  longitude: -123.7014,
  region: 'British Columbia',
  browser: 'Firefox',
  os: 'Mac OS',
  device: 'unknown'
}

*/

