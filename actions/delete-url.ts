"use server";

import { LinkTable } from "@/data-access/links";
import { getSession } from "@/lib/get-session";

export const deleteURL = async (id: number) => {

  const session = await getSession();
  if (!session) return { error: "not authorized" };
  const { id: uid } = session.user;

  const response = await LinkTable.deleteLinkById({
    userId: uid,
    id
  });

  return response;
}
