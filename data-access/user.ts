import "server-only";

import { env } from "@/data-access/env";
import { neon } from '@neondatabase/serverless';
import { z, ZodError } from 'zod';
import { parseQueryResponse, type QueryResponse } from "@/utils/helper";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { ServerResponse, ServerResponseType } from "@/lib/server-repsonse";
import { sql as localSQL } from "./local-connect-test";
import { UserSchemas } from "@/lib/zod/user";

const sql = env.ENV === "dev" ? localSQL : neon(env.DATABASE_URL);

export class UserTable {

  static async deleteAccount({ userId }: { userId: string }): Promise<ServerResponseType<boolean>> {
    try {

      const validatedId = z.number().parse(userId);

      const query = `
        DELETE FROM "user" WHERE id = $1
        RETURNING *;
      `;

      const response: QueryResponse = await sql(query, [validatedId]);
      const result = parseQueryResponse(response, UserSchemas.Delete);

      if (result.length !== 1) return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);

      return ServerResponse.success(true);

    } catch (error: unknown) {
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
}
