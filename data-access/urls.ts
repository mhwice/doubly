import "server-only";

/*
[QUESTION] is .url() is this sufficient or should I be using startsWith(http)?
*/

import { env } from "@/data-access/env";
import { neon } from '@neondatabase/serverless';
import { ZodError } from 'zod';
import { mapFieldsToInsert, parseQueryResponse, type QueryResponse } from "@/utils/helper";
import { LinkSchemas, type LinkTypes } from "@/lib/zod/links";

const sql = neon(env.DATABASE_URL);

const ERROR_MESSAGES = {
  PARSING: "Error parsing data",
  DB_ERROR: "Database error",
  NOT_FOUND: "Link not found"
};

type DALSuccess<T> = { data: T; error?: undefined };
type DALError = { data?: undefined; error: string; };
type DALResponse<T> = DALSuccess<T> | DALError;

export class LinkTable {

  static async createLink(params: LinkTypes.Create): Promise<DALResponse<LinkTypes.Link>> {

    try {

      const parsedData = LinkSchemas.Create.parse(params);
      const filteredData = Object.fromEntries(Object.entries(parsedData).filter(([_, value]) => value !== undefined));
      const tableData = mapFieldsToInsert(filteredData);

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

      if (result.length !== 1) throw new Error();

      return { data: result[0] };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: ERROR_MESSAGES.PARSING };
      return { error: ERROR_MESSAGES.DB_ERROR };
    }
  }

  static async editLink(params: LinkTypes.Edit): Promise<DALResponse<LinkTypes.Link>> {

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

      if (result.length !== 1) return { error: ERROR_MESSAGES.NOT_FOUND };

      return { data: result[0] };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: ERROR_MESSAGES.PARSING };
      return { error: ERROR_MESSAGES.DB_ERROR };
    }
  }

  static async deleteLinkById(params: LinkTypes.Delete): Promise<DALResponse<LinkTypes.Id>> {
    try {
      const { id, userId } = LinkSchemas.Delete.parse(params);

      const query = `
        DELETE FROM links
        WHERE id = $1 AND user_id = $2
        RETURNING *;
      `;

      const response: QueryResponse = await sql(query, [id, userId]);
      const result = parseQueryResponse(response, LinkSchemas.Table);

      if (result.length !== 1) return { error: ERROR_MESSAGES.NOT_FOUND };

      return { data: result[0].id };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: ERROR_MESSAGES.PARSING };
      return { error: ERROR_MESSAGES.DB_ERROR };
    }
  }

  static async #recordClick(params: LinkTypes.Link, source: "qr" | "link"): Promise<DALResponse<LinkTypes.Id>> {
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
      return { data: id };

    } catch (error: unknown) {
      return { error: ERROR_MESSAGES.DB_ERROR };
    }
  }

  static async getLinkByCode(params: LinkTypes.Lookup): Promise<DALResponse<LinkTypes.Link | null>> {

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
      if (result.length === 0) return { data: null, error: undefined };

      const link = result[0];

      await LinkTable.#recordClick(link, source);
      return { data: link };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: ERROR_MESSAGES.PARSING };
      return { error: ERROR_MESSAGES.DB_ERROR };
    }
  }

  static async getAllLinks(params: LinkTypes.GetAll): Promise<DALResponse<LinkTypes.Link[]>> {

    try {
      const { userId } = LinkSchemas.GetAll.parse(params);

      const query = `
        SELECT *
        FROM links
        WHERE user_id = $1;
      `;

      const response: QueryResponse = await sql(query, [userId]);
      const result = parseQueryResponse(response, LinkSchemas.Table);

      // this should only return the dto, not full list of links
      return { data: result };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: "Error parsing data" };
      return { error: "Database error" };
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
