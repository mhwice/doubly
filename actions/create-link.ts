"use server";

import { LinkTable } from "@/data-access/links";
import { isAllowed } from "@/data-access/permission";
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

  return await LinkTable.createLink({
    userId: session.user.id,
    code,
    shortUrl: shortUrl,
    ...validated.data,
  });
}
