"use server";

import { LinkTable } from "@/data-access/links";
import { getSession } from "@/lib/get-session";

interface EditUrlProps {
  userId: string,
  id: number,
  updates: {
    originalUrl: string;
  }
}

export const editURL = async ({ userId, id, updates }: EditUrlProps) => {

  // should this be try-catched?
  // or the getSession function could return
  // { session?, error? }
  // where we either get a session or an error.
  const session = await getSession();
  if (!session) return { error: "not authorized" };
  const { id: uid } = session.user;

  return await LinkTable.editLink({
    id,
    userId: uid,
    updates: {
      originalUrl: updates.originalUrl
    }
  });
}
