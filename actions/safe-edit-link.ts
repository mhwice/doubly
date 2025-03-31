"use server";

import { LinkTable } from "@/data-access/links";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { getSession } from "@/lib/get-session";
import { ServerResponse } from "@/lib/server-repsonse";
import { LinkSchemas, LinkTypes } from "@/lib/zod/links";

export const editLink = async (params: LinkTypes.EditLink) => {

  // 1 - Validate the incoming data
  const validated = LinkSchemas.EditLink.safeParse(params);
  if (!validated.success) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);

  // 2 - Get session data
  const session = await getSession();
  if (!session) return ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED);

  // 3 - Send request to DAL
  const response = await LinkTable.editLink({
    userId: session.user.id,
    ...validated.data
  });

  // 4 - Handle DAL response
  return response;
}
