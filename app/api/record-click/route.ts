import { ClickEvents } from "@/data-access/clicks";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"

export const POST = verifySignatureAppRouter(async (req: Request) => {
  const body = await req.json();
  const clickResponse = await ClickEvents.recordClick(body);
  if (!clickResponse.success) throw new Error(clickResponse.error);
  return Response.json({ success: true });
});
