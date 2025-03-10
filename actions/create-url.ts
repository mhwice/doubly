"use server";

import { saveLink } from "@/data-access/urls";

export const createURL = async (url: string, shortURL: string, code: string, userId: string) => {
  const response = await saveLink(url, shortURL, code, "lcEk6QtuKuBseJigVOXqDkz9dp0Cb7Oe");
  const linkData = response[0];
  return { data: linkData };
}
