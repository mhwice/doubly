import { snakeCase } from "change-case";
import { z } from "zod";
import { serverResponseSchema } from "./clicks";

const DeleteUserSchema = z.object({
  id: z.string().trim().min(1)
})

export namespace UserSchemas {
  export const Delete = DeleteUserSchema;
}

export namespace UserTypes {
  export type Delete = z.infer<typeof DeleteUserSchema>;
}
