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
import { APILinkGetAllSchema, LinkSchemas, type LinkTypes } from "@/lib/zod/links";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { ServerResponse, ServerResponseType } from "@/lib/server-repsonse";
import { sql as localSQL } from "./local-connect-test";

const sql = env.ENV === "dev" ? localSQL : neon(env.DATABASE_URL);

export class LinkTable {
  static async createLink(params: LinkTypes.Create): Promise<ServerResponseType<LinkTypes.Link>> {
    try {

      const tableData = LinkSchemas.Create.parse(params);

      const columns = Object.keys(tableData);
      const placeholders = columns.map((_, i) => `$${i+1}`).join(", ");
      const values = Object.values(tableData);

      const query = `
        INSERT INTO links (${columns})
        VALUES (${placeholders})
        RETURNING *;
      `;

      const response: QueryResponse = await sql(query, values);
      const result = parseQueryResponse(response, LinkSchemas.Table);

      if (result.length !== 1) return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);

      return ServerResponse.success(result[0]);

    } catch (error: unknown) {
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  static async editLink(params: LinkTypes.Edit): Promise<ServerResponseType<LinkTypes.Link>> {

    try {
      const { userId, id, updates: { originalUrl } } = LinkSchemas.Edit.parse(params);

      const query = `
        UPDATE links
        SET original_url = $1
        WHERE id = $2 AND user_id = $3
        RETURNING *;
      `;

      const response = await sql(query, [originalUrl, id, userId]);
      const result = parseQueryResponse(response, LinkSchemas.Table);

      if (result.length !== 1) return ServerResponse.fail(ERROR_MESSAGES.NOT_FOUND);

      return ServerResponse.success(result[0]);

    } catch (error: unknown) {
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  static async deleteLinkById(params: LinkTypes.Delete): Promise<ServerResponseType<LinkTypes.Id>> {
    try {
      const { id, userId } = LinkSchemas.Delete.parse(params);

      const query = `
        DELETE FROM links
        WHERE id = $1 AND user_id = $2
        RETURNING *;
      `;

      const response: QueryResponse = await sql(query, [id, userId]);
      const result = parseQueryResponse(response, LinkSchemas.Table);

      if (result.length !== 1) return ServerResponse.fail(ERROR_MESSAGES.NOT_FOUND);

      return ServerResponse.success(result[0].id);

    } catch (error: unknown) {
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  static async #recordClick(params: LinkTypes.Link, source: "qr" | "link"): Promise<ServerResponseType<LinkTypes.Id>> {
    // don't need to validate here since this method is private and data is already validated
    try {
      const { id } = params;
      const field = source === "qr" ? "qr_clicks" : "link_clicks";

      const query = `
        UPDATE links
        SET ${field} = ${field} + 1
        WHERE id = $1;
      `;

      await sql(query, [id]);
      return ServerResponse.success(id);

    } catch (error: unknown) {
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  static async getLinkByCode(params: LinkTypes.Lookup): Promise<ServerResponseType<LinkTypes.Link | null>> {

    try {
      const { code, source } = LinkSchemas.Lookup.parse(params);

      const query = `
        SELECT *
        FROM links
        WHERE code = $1;
      `;

      const response: QueryResponse = await sql(query, [code]);
      const result = parseQueryResponse(response, LinkSchemas.Table);

      // its not an error, there just doesn't exist any link
      if (result.length === 0) return ServerResponse.success(null);

      const link = result[0];

      await LinkTable.#recordClick(link, source);

      return ServerResponse.success(link);

    } catch (error: unknown) {
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  static async getAllLinks(params: z.infer<typeof APILinkGetAllSchema>): Promise<ServerResponseType<LinkTypes.Dashboard[]>> {

    console.log("refetching")

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
        JOIN (
          SELECT *
          FROM links
          WHERE user_id = $1 AND links.created_at <= $2
        ) AS fl ON fl.id = ce.link_id
        GROUP BY (fl.id, fl.original_url, fl.short_url, fl.updated_at);
      `;

      const response: QueryResponse = await sql(query, [userId, dateEnd]);
      const result = parseQueryResponse(response, LinkSchemas.Dashboard);

      // this should only return the dto, not full list of links
      return ServerResponse.success(result);

    } catch (error: unknown) {
      console.log(error)
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
}

/*

TODO: In the future, the two databse operations in LinkTable.getLinkByCode() should be
      consolodated into a single transaction. I am not doing this right now, because
      I might use Redis for these in the future.

const result = await sql.transaction(async (tx) => {
  const response: QueryResponse = await tx(query, [code]);
  if (response.length === 0) return null;

  const link = parseQueryResponse(response, LinkSchemas.Table)[0];
  await LinkTable.#recordClick(link, source);

  return link;
});

TODO: If a method requires only 1-2 properties from the link table, it might be better
      to extract their type using:
      type UserID = LinkTable['userId']
      and then parse from that, rather than creating a new schema....not sure.

*/
