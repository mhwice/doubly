export const runtime = "nodejs";

import { createLink } from "@/actions/create-link";
import { LinkTable } from "@/data-access/links";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { getSession } from "@/lib/get-session";
import { ServerResponse } from "@/lib/server-repsonse";
import { makeCode, makeShortUrl } from "@/utils/generate-short-code";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { resolve } from "path";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json(ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED));
  if (session.user.email !== "test@doubly.dev") return NextResponse.json(ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED));

  const NUM_BATCHS = 100;
  const LINKS_PER_BATCH = 200;
  const codes = [];
  const idsAndCodes = [];

  for (let batchNum = 1; batchNum <= NUM_BATCHS; batchNum += 1) {

    const data = [];
    for (let it = 0; it < LINKS_PER_BATCH; it += 1) {
      const code = makeCode();
      if (!code) return ServerResponse.fail(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      const shortUrl = makeShortUrl(code);
      const entry = [session.user.id, code, shortUrl, "https://www.google.com"];
      data.push(entry);
      codes.push(code);
    }

    const response = await LinkTable.writeLinkBatch({
      keys: ["user_id", "code", "short_url", "original_url"],
      values: data
    });

    if (!response.success) throw new Error(response.error);
    for (const x of response.data) idsAndCodes.push(x);
  }

  const json = JSON.stringify(codes, null, 2);
  const outPath = resolve(process.cwd(), "tests", "shortLinks.json");
  await writeFile(outPath, json, "utf-8");

  const entries = [];
  for (const { code, linkId } of idsAndCodes) {
    entries.push({
      key: code,
      value: JSON.stringify({ "originalUrl": "https://www.google.com", "linkId": linkId })
    });
  }

  const outPath2 = resolve(process.cwd(), "tests", "kv.json");
  await writeFile(outPath2, JSON.stringify(entries, null, 2), "utf-8");

  return NextResponse.json("done");
}
