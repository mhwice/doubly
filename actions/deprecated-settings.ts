"use server";

import { z } from "zod";
// import { db } from "@/lib/db";
import { SettingsSchema } from "@/schema";
// import { getUserById } from "@/data/user";
// import { currentUser } from "@/lib/depreacted-auth";
import { revalidatePath } from "next/cache";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  // const user = await currentUser();
  // if (!user || !user.id) return { error: "Unauthorized" };
  // const dbUser = await getUserById(user.id);
  // if (!dbUser) return { error: "Unauthorized" };

  // await db.user.update({
  //   where: { id: dbUser.id },
  //   data: {
  //     ...values
  //   }
  // });

  // revalidatePath("/server");
  return { success: "Settings updated" };
}
