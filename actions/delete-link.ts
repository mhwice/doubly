"use server";

import { LinkTable } from "@/data-access/links";
import { isAllowed } from "@/data-access/permission";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { getSession } from "@/lib/get-session";
import { LinkSchema } from "@/lib/schemas/link/link.entity";
import { ServerResponse } from "@/lib/server-repsonse";

/** Must be a non-empty array of valid linkIds */
const LinksIdsSchema = LinkSchema.shape.id.array().nonempty();

export const deleteLink = async (params: unknown) => {

  // 1 - Validate the incoming data
  const validated = LinksIdsSchema.safeParse(params);
  if (!validated.success) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);

  // 2 - Get session data
  const session = await getSession();
  if (!session) return ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED);
  if (!isAllowed(session.user.id)) return ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED);

  // 3 - Send request to DAL
  const response = await LinkTable.deleteLinkById({
    userId: session.user.id,
    ids: validated.data
  });

  // 4 - Handle DAL response
  return response;
}
