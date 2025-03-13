"use server";

import { LinkTable } from "@/data-access/urls";
import { makeCode, makeShortUrl } from "@/utils/generate-short-code";

interface CreateUrlProps {
  url: string,
  password?: string,
  userId: string
}

export const createURL = async ({ url, password, userId }: CreateUrlProps) => {

  const code = makeCode();
  const shortUrl = makeShortUrl(code);

  const success = await LinkTable.createLink({ originalUrl: url, shortUrl, code, userId });
  return success;
}
