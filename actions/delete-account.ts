"use server";

import { isAllowed } from "@/data-access/permission";
import { UserTable } from "@/data-access/user";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { getSession } from "@/lib/get-session";
import { ServerResponse } from "@/lib/server-repsonse";

export const deleteAccount = async () => {

  // 1 - Get session data
  const session = await getSession();
  if (!session) return ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED);
  if (!isAllowed(session.user.id)) return ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED);

  // 2 - Send request to DAL
  const response = await UserTable.deleteAccount({
    userId: session.user.id
  });

  // 3 - Handle DAL response
  return response;
}
