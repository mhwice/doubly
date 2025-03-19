"use server";

import { LinkTable } from "@/data-access/urls";
import { getSession } from "@/lib/get-session";
import { makeCode, makeShortUrl } from "@/utils/generate-short-code";

interface CreateUrlProps {
  url: string,
  password?: string
}

export const createURL = async ({ url, password }: CreateUrlProps) => {

  const session = await getSession();
  if (!session) return { error: "not authorized" };
  const { id: uid } = session.user;

  const code = makeCode();
  const shortUrl = makeShortUrl(code);

  return await LinkTable.createLink({ originalUrl: url, shortUrl, code, userId: uid });
  // return success;
}
