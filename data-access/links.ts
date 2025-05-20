/*
      TODO

      - See if theres any way I can make the helper utils a bit cleaner using Zod transformations


      !! I think I am doing the parsing of db resonses a bit weird.
         Right now I format the unparsed response, then validate it.
         I think I should be doing it in the opposite order.

      - Should the use of the 'sql' function be moved to a different file so I don't make any connections to db?
        I can test this by intentionally throwing an error in a method. Wrap the instantiation of the
        sql variable in a function that logs a message and see if its called.
      - Clean up the naming of DAL functions, and helper functions.

      - Finally, the Zod Schema file needs a lot of work. Need to make sure things are really precise,
        and need to fix the naming. Its a mess currently.

      A note on namenculture.
      • A 'url' points to a location on the internet. Like an address being 123 somestreet.
      • A 'link' takes you from point A to point B. Neither of these points need tom be a location on the internet.

*/

import "server-only";

import { env } from "@/data-access/env";
import { neon } from '@neondatabase/serverless';
import { z, ZodError } from 'zod';
import { parseQueryResponse, type QueryResponse } from "@/utils/helper";
import {
  APILinkGetAllSchema,
  LinkCreateSchema,
  LinkDashboardSchema,
  type Create,
  type Dashboard,
} from "@/lib/zod/links";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { ServerResponse, ServerResponseType } from "@/lib/server-repsonse";
import { sql as localSQL } from "./local-connect-test";
import {
  LinkSchema,
  type Link,
} from "@/lib/schemas/link/link.entity";

const sql = env.ENV === "dev" ? localSQL : neon(env.DATABASE_URL);

/** An object holding a userId and an array of valid linkIds */
const LinkDeleteSchema = z.object({
  ids: LinkSchema.shape.id.array().nonempty(),
  userId: LinkSchema.shape.userId
}).strict();

/** An object holding a userId, a linkId, and an object of updates */
const LinkEditSchema = z.object({
  userId: LinkSchema.shape.userId,
  id: LinkSchema.shape.id,
  updates: z.object({
    originalUrl: LinkSchema.shape.originalUrl
  }).strict()
}).strict();

/** A link code */
const LinkCodeSchema = LinkSchema.shape.code;

type LinkIdArray = z.infer<typeof LinkSchema.shape.id>[];

export class LinkTable {

  static async getLinkByCode(params: z.infer<typeof LinkCodeSchema>): Promise<ServerResponseType<Link>> {
    try {

      const code = LinkCodeSchema.parse(params);

      const query = `
        SELECT *
        FROM links
        WHERE code = $1
      `;

      const response: QueryResponse = await sql(query, [code]);
      const result = parseQueryResponse(response, LinkSchema);

      if (result.length !== 1) return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);

      return ServerResponse.success(result[0]);

    } catch (error: unknown) {
      console.log(error)
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  static async createLink(params: Create): Promise<ServerResponseType<Link>> {
    try {

      /*

        params = {
          originalUrl
          shortUrl
          code
          userId
        }

        all required. must map keys to snake case

      */
      const tableData = LinkCreateSchema.parse(params);

      const columns = Object.keys(tableData);
      const placeholders = columns.map((_, i) => `$${i+1}`).join(", ");
      const values = Object.values(tableData);

      const query = `
        INSERT INTO links (${columns})
        VALUES (${placeholders})
        RETURNING *;
      `;

      const response: QueryResponse = await sql(query, values);
      const result = parseQueryResponse(response, LinkSchema);

      if (result.length !== 1) return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);

      return ServerResponse.success(result[0]);

    } catch (error: unknown) {
      console.log(error)
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  static async editLink(params: z.infer<typeof LinkEditSchema>): Promise<ServerResponseType<Link>> {
    try {

      const { userId, id, updates: { originalUrl } } = LinkEditSchema.parse(params);

      const query = `
        UPDATE links
        SET original_url = $1
        WHERE id = $2 AND user_id = $3
        RETURNING *;
      `;

      const response = await sql(query, [originalUrl, id, userId]);
      const result = parseQueryResponse(response, LinkSchema);

      if (result.length !== 1) return ServerResponse.fail(ERROR_MESSAGES.NOT_FOUND);

      return ServerResponse.success(result[0]);

    } catch (error: unknown) {
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  static async deleteLinkById(params: z.infer<typeof LinkDeleteSchema>): Promise<ServerResponseType<LinkIdArray>> {
    try {

      const { ids, userId } = LinkDeleteSchema.parse(params);

      const placeholders = ids.map((_, idx) => `$${idx+2}`).join(", ");

      const query = `
        DELETE FROM links
        WHERE user_id = $1 AND id in (${placeholders})
        RETURNING *;
      `;

      const response: QueryResponse = await sql(query, [userId, ...ids]);
      const result = parseQueryResponse(response, LinkSchema);

      // if (result.length !== 1) return ServerResponse.fail(ERROR_MESSAGES.NOT_FOUND);

      const deletedIds = result.map((x) => x.id)
      return ServerResponse.success(deletedIds);

    } catch (error: unknown) {
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  static async getAllLinks(params: z.infer<typeof APILinkGetAllSchema>): Promise<ServerResponseType<Dashboard[]>> {

    // this needs to be updated so it takes in the (date optional) and filters using that
    try {
      const { userId, dateEnd } = APILinkGetAllSchema.parse(params);

      const query = `
        SELECT
          fl.id AS id,
          fl.original_url AS original_url,
          fl.short_url AS short_url,
          fl.updated_at AS updated_at,
          SUM(
            CASE
              WHEN ce.source = 'qr' THEN 1
              ELSE 0
            END
          ) AS qr_clicks,
          SUM(
            CASE
              WHEN ce.source = 'link' THEN 1
              ELSE 0
            END
          ) AS link_clicks
        FROM click_events AS ce
        RIGHT JOIN (
          SELECT *
          FROM links
          WHERE user_id = $1 AND links.created_at <= $2
        ) AS fl ON fl.id = ce.link_id
        GROUP BY (fl.id, fl.original_url, fl.short_url, fl.updated_at)
        ORDER BY fl.updated_at DESC;
      `;

      // console.log(query, userId, dateEnd)
      const response: QueryResponse = await sql(query, [userId, dateEnd]);
      const result = parseQueryResponse(response, LinkDashboardSchema);

      // this should only return the dto, not full list of links
      return ServerResponse.success(result);

    } catch (error: unknown) {
      console.log(error)
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
}
