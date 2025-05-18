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

[INVALID DATA] {
  code: 'abc123def456',
  createdAt: '2025-05-18T18:14:38.963Z',
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
} Error [ZodError]: [
  {
    "code": "invalid_type",
    "expected": "number",
    "received": "undefined",
    "path": [
      "linkId"
    ],
    "message": "Required"
  }
]
    at get error (.next/server/chunks/6408.js:1:9160)
    at <unknown> (.next/server/app/api/record-click/route.js:1:2186) {
  issues: [Array],
  addIssue: [Function (anonymous)],
  addIssues: [Function (anonymous)]
}

*/

