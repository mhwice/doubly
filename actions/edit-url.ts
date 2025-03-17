"use server";

import { LinkTable } from "@/data-access/urls";
import { makeCode, makeShortUrl } from "@/utils/generate-short-code";

interface EditUrlProps {
  userId: string,
  id: number,
  updates: {
    originalUrl: string;
  }
}

export const editURL = async ({ userId, id, updates }: EditUrlProps) => {

  return await LinkTable.editLink({
    id,
    userId,
    updates: {
      originalUrl: updates.originalUrl
    }
  });
}
