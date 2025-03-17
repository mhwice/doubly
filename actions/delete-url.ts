"use server";

import { LinkTable } from "@/data-access/urls";

export const deleteURL = async (id: number, userId: string) => {
  const response = await LinkTable.deleteLinkById({
    userId,
    id
  });

  return response;
}
