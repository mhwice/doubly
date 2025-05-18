import "server-only";

import { env } from "@/data-access/env";
import { neon } from '@neondatabase/serverless';
import { z, ZodError } from 'zod';
import { type QueryResponse } from "@/utils/helper";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { ServerResponse, ServerResponseType } from "@/lib/server-repsonse";
import { sql as localSQL } from "./local-connect-test";

const sql = env.ENV === "dev" ? localSQL : neon(env.DATABASE_URL);

export class UserTable {

  static async deleteAccount({ userId }: { userId: string }): Promise<ServerResponseType<boolean>> {
    try {

      const validatedId = z.string().parse(userId);

      const query = `
        SELECT delete_user_cascade($1)
      `;

      const response: QueryResponse = await sql(query, [validatedId]);
      const validatedResult = z.object({ delete_user_cascade: z.string().trim().min(1).nullable() }).array().length(1).safeParse(response);
      if (!validatedResult.success) return ServerResponse.fail("failed to delete user");
      if (!validatedResult.data[0].delete_user_cascade) return ServerResponse.fail("failed to delete user");

      return ServerResponse.success(true);

    } catch (error: unknown) {
      console.log(error)
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
}
