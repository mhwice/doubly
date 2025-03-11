"use server";

import { LinkTable } from "@/data-access/urls";

export const createURL = async (url: string, shortUrl: string, code: string, userId: string) => {
  const success = await LinkTable.createLink({ originalUrl: url, shortUrl, code, userId: "lcEk6QtuKuBseJigVOXqDkz9dp0Cb7Oe" });
  return success;
}
