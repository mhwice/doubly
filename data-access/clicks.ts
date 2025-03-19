import "server-only";

import { env } from "@/data-access/env";
import { neon } from '@neondatabase/serverless';
import { ZodError } from 'zod';
import { mapFieldsToInsert, parseQueryResponse, type QueryResponse } from "@/utils/helper";
import { ClickEventSchemas, type ClickEventTypes } from "@/lib/zod/clicks";
import { LinkSchemas, LinkTypes } from "@/lib/zod/links";

const sql = neon(env.DATABASE_URL);

const ERROR_MESSAGES = {
  PARSING: "Error parsing data",
  DB_ERROR: "Database error",
  NOT_FOUND: "Link not found"
};

type DALSuccess<T> = { data: T; error?: undefined };
type DALError = { data?: undefined; error: string; };
type DALResponse<T> = DALSuccess<T> | DALError;

export class ClickEvents {
  static async recordClick(params: ClickEventTypes.Create): Promise<DALResponse<ClickEventTypes.Click>> {
    try {
      const parsedData = ClickEventSchemas.Create.parse(params);
      const filteredData = Object.fromEntries(Object.entries(parsedData).filter(([_, value]) => value !== undefined));
      const tableData = mapFieldsToInsert(filteredData);

      const columns = Object.keys(tableData);
      const placeholders = columns.map((_, i) => `$${i+1}`).join(", ");
      const values = Object.values(tableData);

      const query = `
        INSERT INTO click_events (${columns})
        VALUES (${placeholders})
        RETURNING *;
      `;

      const response: QueryResponse = await sql(query, values);
      const result = parseQueryResponse(response, ClickEventSchemas.Click);

      if (result.length !== 1) throw new Error();

      return { data: result[0] };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: ERROR_MESSAGES.PARSING };
      return { error: ERROR_MESSAGES.DB_ERROR };
    }
  }

  static async getAllClicks(params: ClickEventTypes.GetAll): Promise<DALResponse<ClickEventTypes.Click[]>> {
    try {
      const { linkId } = ClickEventSchemas.GetAll.parse(params);

      const query = `
        SELECT *
        FROM click_events
        WHERE link_id = $1;
      `;

      const response: QueryResponse = await sql(query, [linkId]);
      const result = parseQueryResponse(response, ClickEventSchemas.Click);

      // this should only return the dto, not full list of clicks?
      return { data: result };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: ERROR_MESSAGES.PARSING };
      return { error: ERROR_MESSAGES.DB_ERROR };
    }
  }

  /*
    TODO
    It is currently unclear whether this should be a single query for the user with a JOIN,
    or maybe many individual calls.... who should have acces (owner only?)

    For now its fine, but should be revised later.
  */
  static async getClicksByLinkId(params: LinkTypes.ClickEvent): Promise<DALResponse<ClickEventTypes.Click[]>> {
    try {
      const { id, userId } = LinkSchemas.ClickEvent.parse(params);

      const query = `
        SELECT *
        FROM click_events
        WHERE link_id = $1;
      `;

      const response: QueryResponse = await sql(query, [id]);
      const result = parseQueryResponse(response, ClickEventSchemas.Click);

      // this should only return the dto, not full list of links
      return { data: result };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: ERROR_MESSAGES.PARSING };
      return { error: ERROR_MESSAGES.DB_ERROR };
    }
  }
}
