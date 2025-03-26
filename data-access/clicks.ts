import "server-only";

import { promises as fs } from "fs";
import { env } from "@/data-access/env";
import { neon } from '@neondatabase/serverless';
import { ZodError } from 'zod';
import { mapFieldsToInsert, parseChartQueryResponse, parseFilterQueryResponse, parseQueryResponse, type QueryResponse } from "@/utils/helper";
import { ClickEventSchemas, type ClickEventTypes } from "@/lib/zod/clicks";
import { LinkSchemas, LinkTypes } from "@/lib/zod/links";
import { snakeCase } from "change-case";
import path from "path";

import { types } from "pg";

types.setTypeParser(types.builtins.FLOAT4, (val) => {
  return parseFloat(val);
});

// types.setTypeParser(types.builtins.TIMESTAMPTZ, (val) => {
//   return new Date(val);
// });

const sql = neon(env.DATABASE_URL);

const ERROR_MESSAGES = {
  PARSING: "Error parsing data",
  DB_ERROR: "Database error",
  NOT_FOUND: "Link not found"
};

type DALSuccess<T> = { data: T; error?: undefined };
type DALError = { data?: undefined; error: string; };
type DALResponse<T> = DALSuccess<T> | DALError;

export type FilterRepsonse = {
  filter: ClickEventTypes.Filter[],
  chart: ClickEventTypes.Chart[]
}

export class ClickEvents {

  static async getCoords() {
    try {

      const query = `
        SELECT COUNT(*)
        FROM click_events
      `;

      const response = await sql(query, []);
      console.log(response);
      // const x = response[2].latitude;
      // const result = parseQueryResponse(response, ClickEventSchemas.Click);

      // if (result.length !== 1) throw new Error();

      return { data: "done" };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: ERROR_MESSAGES.PARSING };
      return { error: ERROR_MESSAGES.DB_ERROR };
    }
  }

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
  static async getFilterMenuData(params: LinkTypes.GetAll): Promise<DALResponse<FilterRepsonse>> {
    try {
      const { userId, options, dateRange } = LinkSchemas.GetAll.parse(params);

      // note the dateRange values are still strings here
      // console.log({userId, options, dateRange})

      // ["source", "qr"],
      // ["source", "link"],
      // ["country", "canada"],

      // this makes sure we have unique kv pairs.

      // const map = new Map();
      // for (const [k, v] of options || []) {
      //   map.set(k, (map.get(k) || new Set()).add(v));
      // }

      // for (const [k, vs] of map) {
      //   map.set(k, Array.from(vs));
      // }

      // [
      //   { key: "source", values: ["qr", "link"]},
      //   { key: "country", values: ["canada"]},
      // ]

      // let dummyOptions = [["source", "qr"], ["country", "canada"]];

      // all i want to do is filter the source by qr

      // const query1 = `
      //   WITH user_links AS (
      //     SELECT *
      //     FROM links
      //     WHERE user_id = $1
      //   ), your_table AS (
      //     SELECT *
      //     FROM click_events AS ce
      //     JOIN user_links ON user_links.id = ce.link_id
      //   )

      //   SELECT 'source' AS field, source::TEXT AS value, COUNT(*) AS count FROM your_table GROUP BY source
      //   UNION ALL
      //   SELECT 'country' AS field, country::TEXT AS value, COUNT(*) FROM your_table GROUP BY country
      //   UNION ALL
      //   SELECT 'continent' AS field, continent::TEXT AS value, COUNT(*) FROM your_table GROUP BY continent
      //   UNION ALL
      //   SELECT 'city' AS field, city::TEXT AS value, COUNT(*) FROM your_table GROUP BY city
      //   UNION ALL
      //   SELECT 'short_url' AS field, short_url::TEXT AS value, COUNT(*) FROM your_table GROUP BY short_url
      //   UNION ALL
      //   SELECT 'original_url' AS field, original_url::TEXT AS value, COUNT(*) FROM your_table GROUP BY original_url;
      // `;

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

      // const ex = [
      //   { key: "source", values: ["qr"] },
      //   { key: "country", values: ["CA", "RO"] },
      // ];

      // const data = await fs.readFile(path.join(process.cwd(), "./utils/countries.json"));
      // const parsed = JSON.parse(data.toString());

      const conditions = [];
      const queryParams = [userId];
      let placeholderIndex = 2;

      for (let [key, values] of options) {
        if (values.length === 0) continue;
        const formattedKey = snakeCase(key);

        /*

        TODO

        In my edge function, Vercel gives me the 2 digit country code.
        To keep the function fast, I just save that in the db - no extra work.

        But now in my analytics page, I want to fetch something like "Canada" not "CA", but the db only knows "CA".
        So I can have a new table in the DB that just maps country codes to names.
        Then I can do a join in the db to get the country names back.

        This is a good idea, but I am going to wait until I know how Redis comes into play.
        So for now, the countries list will be their 2 digit code

        */

        // if (key === "country") {
        //   // console.log(key, values)
        //   const ccs = [];
        //   looking: for (const cname of values) {
        //     for (const { name, code } of parsed) {
        //       console.log(cname, name, code)
        //       if (cname === name) {
        //         ccs.push(code);
        //         continue looking;
        //       }
        //     }
        //   }

        //   if (ccs.length === 0) continue;
        //   values = ccs;
        // }

        const placeholders = values.map(() => `$${placeholderIndex++}`).join(", ");
        conditions.push(`${formattedKey} IN (${placeholders})`);

        queryParams.push(...values);
      }

      // WHERE created_at >= startDate AND created_at <= endDate
      if (dateRange) {
        const { start, end } = dateRange;
        conditions.push(`ce.created_at >= $${placeholderIndex++}`);
        conditions.push(`ce.created_at <= $${placeholderIndex++}`);
        queryParams.push(start);
        queryParams.push(end);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      // console.log(whereClause)
      // console.log(queryParams)

      const query = `
        WITH filtered_clicks AS (
          SELECT
            ce.source AS source,
            ce.city AS city,
            ce.country AS country,
            ce.continent AS continent,
            user_links.short_url AS short_url,
            user_links.original_url AS original_url,
            ce.created_at AS created_at
          FROM click_events AS ce
          JOIN (
            SELECT *
            FROM links
            -- TODO, if I filter our short_url and original_url here, then this becomes more efficient
            -- as we aren't doing a join on as many records, and the subsequent steps are faster
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



      // this query is aimed at getting the data for the charts/graphs
      // cares about the bucketed rows
      // same cte, but then the rest is a bit different
      // for each valid row I want the, I split into 2 groups by source (qr, link)
      // then, i want to group that by some 'bucket' for now it will be days, and return
      // [day, linkCount, qrCount]
      // and I want this sorted by day
      const query2 = `
        WITH filtered_clicks AS (
          SELECT
            ce.source AS source,
            ce.city AS city,
            ce.country AS country,
            ce.continent AS continent,
            user_links.short_url AS short_url,
            user_links.original_url AS original_url,
            ce.created_at AS created_at
          FROM click_events AS ce
          JOIN (
            SELECT *
            FROM links
            -- TODO, if I filter our short_url and original_url here, then this becomes more efficient
            -- as we aren't doing a join on as many records, and the subsequent steps are faster
            WHERE user_id = $1
          ) AS user_links ON user_links.id = ce.link_id
          -- WHERE source IN ('qr') AND country IN ('CA', 'RO')
          ${whereClause}
        )

        SELECT
          date_trunc('day', created_at) AS date,
          SUM(
            CASE
              WHEN source = 'qr' THEN 1
              ELSE 0
            END
          ) AS qr_count,
          SUM(
            CASE
              WHEN source = 'link' THEN 1
              ELSE 0
            END
          ) AS link_count
        FROM filtered_clicks
        GROUP BY date;
      `;

      const response: QueryResponse = await sql(query, queryParams);
      const result = parseFilterQueryResponse(response, ClickEventSchemas.Filter);

      const response2: QueryResponse = await sql(query2, queryParams);
      // console.log({response2})
      const result2 = parseChartQueryResponse(response2, ClickEventSchemas.Chart);
      // console.log({response})
      // console.log("here", result)


      // TODO
      // I am not 100% that this is correct.
      // If there is no click data, what is the result?
      // if (result.length !== 1) throw new Error();

      return {
        data: {
          filter: result,
          chart: result2
        }
      };

    } catch (error: unknown) {
      if (error instanceof ZodError) return { error: ERROR_MESSAGES.PARSING };
      return { error: ERROR_MESSAGES.DB_ERROR };
    }
  }
}
