/*

Consumes the queue events

*/

import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"

export const POST = verifySignatureAppRouter(async (req: Request) => {
  const body = await req.json();
  console.log("body", body);
  return new Response(body);
})

