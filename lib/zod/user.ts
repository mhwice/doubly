import { snakeCase } from "change-case";
import { z } from "zod";
import { serverResponseSchema } from "./clicks";

const DeleteUserSchema = z.object({
  delete_user_cascade: z.string().trim().min(1).nullable()
})

export namespace UserSchemas {
  export const Delete = DeleteUserSchema;
}

export namespace UserTypes {
  export type Delete = z.infer<typeof DeleteUserSchema>;
}
