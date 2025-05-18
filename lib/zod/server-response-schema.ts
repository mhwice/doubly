import { z } from "zod";

/**
 * Given a Zod schema, this function returns a new schema which mirrors a ServerResponse that contains the
 * provided schema. This is very useful for validating the data returned from an API or Server Action.
 *
 * @param dataSchema
 * @returns
 */
export function serverResponseSchema<T>(dataSchema: z.ZodType<T>) {
  return z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      data: dataSchema,
    }),
    z.object({
      success: z.literal(false),
      error: z.string(),
    }),
  ]);
}
