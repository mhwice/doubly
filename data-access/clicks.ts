import "server-only";

import { env } from "@/data-access/env";
import { neon } from '@neondatabase/serverless';
import { ZodError } from 'zod';
import { mapFieldsToInsert, parseFilterQueryResponse, parseQueryResponse, type QueryResponse } from "@/utils/helper";
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

  // All clicks for all links for the current user
  static async getAllClicks(params: LinkTypes.GetAll): Promise<DALResponse<ClickEventTypes.Click[]>> {
    try {
      const { userId } = LinkSchemas.GetAll.parse(params);

      const query = `
        SELECT ce.*
        FROM click_events AS ce
        JOIN (
          SELECT *
          FROM links
          WHERE user_id = $1
        ) AS fl ON fl.id = ce.link_id;
      `;

      const response: QueryResponse = await sql(query, [userId]);
      const result = parseQueryResponse(response, ClickEventSchemas.Click);

      // this should only return the dto, not full list of clicks?
      return { data: result };

    } catch (error: unknown) {
      console.log(error)
      if (error instanceof ZodError) return { error: ERROR_MESSAGES.PARSING };
      return { error: ERROR_MESSAGES.DB_ERROR };
    }
  }

  // All clicks for the given link and user
  static async getClicksByLinkId(params: LinkTypes.ClickEvent): Promise<DALResponse<ClickEventTypes.Click[]>> {
    try {
      const { id, userId } = LinkSchemas.ClickEvent.parse(params);

      const query = `
        SELECT ce.*,
        FROM click_events AS ce
        JOIN (
          SELECT *
          FROM links
          WHERE id = $1 AND user_id = $2
        ) AS fl ON fl.id = ce.link_id;
      `;

      const response: QueryResponse = await sql(query, [id, userId]);
      const result = parseQueryResponse(response, ClickEventSchemas.Click);

      // this should only return the dto, not full list of links
      return { data: result };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: ERROR_MESSAGES.PARSING };
      return { error: ERROR_MESSAGES.DB_ERROR };
    }
  }

  /*
    Given some filter criteria, we need to return all of the unique items and their count, so we can
    use this in combobox filter.

    To start, lets apply no filters, and simply return all of the data for all clicks.

    So I want:

    source: [link, qr],
    country: [cananda, mexicon, italy, ...],
    continent: [europe, south america, ...],

  */
  static async getFilterMenuData(params: LinkTypes.GetAll): Promise<DALResponse<ClickEventTypes.Filter[]>> {
    try {
      const { userId, options } = LinkSchemas.GetAll.parse(params);
      console.log(options)

      // ["source", "qr"],
      // ["source", "link"],
      // ["country", "canada"],

      // [
      //   { key: "source", values: ["qr", "link"]},
      //   { key: "country", values: ["canada"]},
      // ]

      // let dummyOptions = [["source", "qr"], ["country", "canada"]];

      // all i want to do is filter the source by qr

      const query1 = `
        WITH user_links AS (
          SELECT *
          FROM links
          WHERE user_id = $1
        ), your_table AS (
          SELECT *
          FROM click_events AS ce
          JOIN user_links ON user_links.id = ce.link_id
        )

        SELECT 'source' AS field, source::TEXT AS value, COUNT(*) AS count FROM your_table GROUP BY source
        UNION ALL
        SELECT 'country' AS field, country::TEXT AS value, COUNT(*) FROM your_table GROUP BY country
        UNION ALL
        SELECT 'continent' AS field, continent::TEXT AS value, COUNT(*) FROM your_table GROUP BY continent
        UNION ALL
        SELECT 'city' AS field, city::TEXT AS value, COUNT(*) FROM your_table GROUP BY city
        UNION ALL
        SELECT 'short_url' AS field, short_url::TEXT AS value, COUNT(*) FROM your_table GROUP BY short_url
        UNION ALL
        SELECT 'original_url' AS field, original_url::TEXT AS value, COUNT(*) FROM your_table GROUP BY original_url;
      `;

      /*

      const columns = Object.keys(tableData);
      const placeholders = columns.map((_, i) => `$${i+1}`).join(", ");
      const values = Object.values(tableData);

      const query = `
        INSERT INTO links (${columns})
        VALUES (${placeholders})
        RETURNING *;
      `;

      */

     // [TODO SUPER IMPORTANT!] use Zod to make sure that the key is one of source, country, continuent, etc.
     // otherwise open to sql injections!

     // WHERE source IN ('qr') AND country IN ('CA', 'RO')

      const ex = [
        { key: "source", values: ["qr"] },
        { key: "country", values: ["CA", "RO"] },
      ];

      const conditions = [];
      const queryParams = [userId];
      let placeholderIndex = 2;

      for (const { key, values } of ex) {
        if (values.length === 0) continue;

        const placeholders = values.map(() => `$${placeholderIndex++}`).join(", ");
        conditions.push(`${key} IN (${placeholders})`);

        queryParams.push(...values);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      const query = `
        WITH filtered_clicks AS (
          SELECT *
          FROM click_events AS ce
          JOIN (
            SELECT *
            FROM links
            WHERE user_id = $1
          ) AS user_links ON user_links.id = ce.link_id
          -- WHERE source IN ('qr') AND country IN ('CA', 'RO')
          ${whereClause}
        )

        SELECT 'source' AS field, source::TEXT AS value, COUNT(*) AS count
        FROM filtered_clicks
        GROUP BY source

        UNION ALL

        SELECT 'country' AS field, country::TEXT AS value, COUNT(*)
        FROM filtered_clicks
        GROUP BY country

        UNION ALL

        SELECT 'continent' AS field, continent::TEXT AS value, COUNT(*)
        FROM filtered_clicks
        GROUP BY continent

        UNION ALL

        SELECT 'city' AS field, city::TEXT AS value, COUNT(*)
        FROM filtered_clicks
        GROUP BY city

        UNION ALL

        SELECT 'short_url' AS field, short_url::TEXT AS value, COUNT(*)
        FROM filtered_clicks
        GROUP BY short_url

        UNION ALL

        SELECT 'original_url' AS field, original_url::TEXT AS value, COUNT(*)
        FROM filtered_clicks
        GROUP BY original_url;
      `;

      const response: QueryResponse = await sql(query, queryParams);
      // console.log(response)
      const result = parseFilterQueryResponse(response, ClickEventSchemas.Filter);
      // console.log("here", result)


      // TODO
      // I am not 100% that this is correct.
      // If there is no click data, what is the result?
      // if (result.length !== 1) throw new Error();

      return { data: result };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: ERROR_MESSAGES.PARSING };
      return { error: ERROR_MESSAGES.DB_ERROR };
    }
  }
}
