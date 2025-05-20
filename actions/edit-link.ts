"use server";

import { LinkTable } from "@/data-access/links";
import { isAllowed } from "@/data-access/permission";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { getSession } from "@/lib/get-session";
import { LinkSchema } from "@/lib/schemas/link/link.entity";
import { ServerResponse } from "@/lib/server-repsonse";
import { z } from "zod";

/*

params should just be

{
  id: number,
  updates: {
    originalUrl: string
  }
}

*/

const EditLinkSchema = z.object({
  id: LinkSchema.shape.id,
  updates: z.object({
    originalUrl: LinkSchema.shape.originalUrl
  }).strict()
}).strict()

export const editLink = async (params: unknown) => {

  // 1 - Validate the incoming data
  // const validated = LinkEditLinkSchema.safeParse(params);
  const validated = EditLinkSchema.safeParse(params);
  if (!validated.success) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);

  // 2 - Get session data
  const session = await getSession();
  if (!session) return ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED);
  if (!isAllowed(session.user.id)) return ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED);

  // 3 - Send request to DAL
  const response = await LinkTable.editLink({
    userId: session.user.id,
    ...validated.data
  });

  // 4 - Handle DAL response
  if (!response.success) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
  return response.data;
}
