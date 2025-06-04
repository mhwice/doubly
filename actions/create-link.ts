"use server";

import { writeToKV } from "@/data-access/cloudflare-kv";
import { LinkTable } from "@/data-access/links";
import { isAllowed } from "@/data-access/permission";
import { cacheLink } from "@/data-access/redis";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { getSession } from "@/lib/get-session";
import { ServerResponse } from "@/lib/server-repsonse";
import { OriginalUrlSchema } from "@/lib/zod/links";
import { makeCode, makeShortUrl } from "@/utils/generate-short-code";

/*

params should just be

{ originalUrl: string }

*/

export const createLink = async (params: unknown) => {

  // 1 - Validate the incoming data
  const validated = OriginalUrlSchema.safeParse(params);
  if (!validated.success) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);

  // 2 - Get session data
  const session = await getSession();
  if (!session) return ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED);

  if (!isAllowed(session.user.id)) return ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED);

  // 3 - Send request to DAL
  const code = makeCode();
  if (!code) return ServerResponse.fail(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  const shortUrl = makeShortUrl(code);

  const dbResponse = await LinkTable.createLink({
    userId: session.user.id,
    code,
    shortUrl: shortUrl,
    ...validated.data,
  });

  if (!dbResponse.success) {
    return dbResponse; // our existing error handling logic will kick in
  }

  const { code: shortCode, originalUrl, id: linkId } = dbResponse.data;

  console.log("writing to kv", shortCode, originalUrl, linkId);
  writeToKV(shortCode, originalUrl, linkId)
    .then(() => console.log("writeToKV resolved"))
    .catch((e) => console.error("failed to write to kv", e));

  console.log("writing to redis", shortCode, originalUrl, linkId);
  cacheLink(shortCode, originalUrl, linkId)
    .then(() => console.log("cacheLink resolved"))
    .catch((e) => console.error("failed to write to redis", e));

  return dbResponse;
}
