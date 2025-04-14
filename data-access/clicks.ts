import "server-only";

import { env } from "@/data-access/env";
import { neon } from '@neondatabase/serverless';
import { ZodError } from 'zod';
import { parseJSONQueryResponse, parseQueryResponse, type QueryResponse } from "@/utils/helper";
import { ClickEventSchemas, type ClickEventTypes } from "@/lib/zod/clicks";
import { CityDALLookup, LinkSchemas, LinkTypes } from "@/lib/zod/links";
import { snakeCase } from "change-case";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { ServerResponse, ServerResponseType } from "@/lib/server-repsonse";
import { sql as localSQL } from "./local-connect-test";

const sql = env.ENV === "dev" ? localSQL : neon(env.DATABASE_URL);

interface Cities {
  query: string,
  userId: string
}

/**
 * Data-Access-Layer (DAL) for all ClickEvents
 */
export class ClickEvents {

  static async recordClick(params: ClickEventTypes.Create): Promise<ServerResponseType<ClickEventTypes.Click>> {
    try {
      const tableData = ClickEventSchemas.Create.parse(params);

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

      if (result.length !== 1) return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);

      return ServerResponse.success(result[0]);

    } catch (error: unknown) {
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  // All clicks for all links for the current user
  // static async getAllClicks(params: LinkTypes.GetAll): Promise<ServerResponseType<ClickEventTypes.Click[]>> {
  //   try {
  //     const { userId } = LinkSchemas.GetAll.parse(params);

  //     const query = `
  //       SELECT ce.*
  //       FROM click_events AS ce
  //       JOIN (
  //         SELECT *
  //         FROM links
  //         WHERE user_id = $1
  //       ) AS fl ON fl.id = ce.link_id;
  //     `;

  //     const response: QueryResponse = await sql(query, [userId]);
  //     const result = parseQueryResponse(response, ClickEventSchemas.Click);

  //     // this should only return the dto, not full list of clicks?
  //     return ServerResponse.success(result);

  //   } catch (error: unknown) {
  //     console.log(error)
  //     if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
  //     return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
  //   }
  // }

  // All clicks for the given link and user
  // static async getClicksByLinkId(params: LinkTypes.ClickEvent): Promise<ServerResponseType<ClickEventTypes.Click[]>> {
  //   try {
  //     const { id, userId } = LinkSchemas.ClickEvent.parse(params);

  //     const query = `
  //       SELECT ce.*,
  //       FROM click_events AS ce
  //       JOIN (
  //         SELECT *
  //         FROM links
  //         WHERE id = $1 AND user_id = $2
  //       ) AS fl ON fl.id = ce.link_id;
  //     `;

  //     const response: QueryResponse = await sql(query, [id, userId]);
  //     const result = parseQueryResponse(response, ClickEventSchemas.Click);

  //     // this should only return the dto, not full list of links
  //     return ServerResponse.success(result);

  //   } catch (error: unknown) {
  //     if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
  //     return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
  //   }
  // }



  static async getCities(params: Cities): Promise<ServerResponseType<ClickEventTypes.Filter[]>> {
    try {
      const { userId, query } = CityDALLookup.parse(params);

      const sqlQuery = `
        WITH filtered_clicks AS (
          SELECT
            ce.city AS city
          FROM click_events AS ce
          JOIN (
            SELECT *
            FROM links
            WHERE user_id = $1
          ) AS user_links ON user_links.id = ce.link_id
          WHERE ce.city ILIKE '%' || $2 || '%'
        )

        SELECT 'city' AS field, city::TEXT AS value, COUNT(*) AS count
        FROM filtered_clicks
        GROUP BY city
        ORDER BY count DESC, value;
      `;

      const response: QueryResponse = await sql(sqlQuery, [userId, query]);
      const result = parseQueryResponse(response, ClickEventSchemas.Filter, ["field"]);

      return ServerResponse.success(result);
    } catch (error: unknown) {
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
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

  static async getQueriedData(params: LinkTypes.GetAll): Promise<ServerResponseType<ClickEventTypes.Query[]>> {
    try {
      const { userId, options, dateRange, queryString, queryField } = LinkSchemas.GetAll.parse(params);

      const LIMIT = "50";

      const conditions = [];
      const queryParams = [userId];
      let placeholderIndex = queryParams.length + 1;

      for (let [key, values] of options) {
        if (values.length === 0) continue;
        const formattedKey = snakeCase(key);

        const placeholders = values.map(() => `$${placeholderIndex++}`).join(", ");
        conditions.push(`${formattedKey} IN (${placeholders})`);

        queryParams.push(...values);
      }

      if (dateRange[0]) {
        queryParams.push(dateRange[0].toISOString());
        conditions.push(`ce.created_at >= $${placeholderIndex++}`);
      }

      queryParams.push(dateRange[1].toISOString());
      conditions.push(`ce.created_at <= $${placeholderIndex++}`);

      if (queryString && queryField) {
        conditions.push(`${queryField} ILIKE '%' || $${placeholderIndex++} || '%'`);
        queryParams.push(queryString);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      const testquery = `
        WITH filtered_clicks AS (
          SELECT
            ce.source AS source,
            ce.city AS city,
            ce.country AS country,
            ce.region AS region,
            ce.continent AS continent,
            user_links.short_url AS short_url,
            user_links.original_url AS original_url,
            ce.created_at AS created_at,
            ce.browser AS browser,
            ce.device AS device,
            ce.os AS os
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
        ),
        total_count AS (
          SELECT COUNT(*) AS total FROM filtered_clicks
        )

        SELECT ${queryField}::TEXT AS value, '${queryField}:' || ${queryField} AS label, COUNT(*) AS count, (COUNT(*) * 100.0 / (SELECT total FROM total_count)) AS percent
        FROM filtered_clicks
        GROUP BY ${queryField}
        ORDER BY count DESC, value
        LIMIT $${placeholderIndex}
      `;

      // console.log(testquery)

      const testResponse: QueryResponse = await sql(testquery, [...queryParams, LIMIT]);
      const testResult = parseQueryResponse(testResponse, ClickEventSchemas.Query);

      return ServerResponse.success(testResult);

    } catch (error: unknown) {
      console.log({ error })
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  static async getFilterMenuData(params: LinkTypes.GetAll): Promise<ServerResponseType<ClickEventTypes.ClickResponse>> {
    try {
      const { userId, options, dateRange, queryString, queryField } = LinkSchemas.GetAll.parse(params);

      const LIMIT = "50";

      const conditions = [];
      const queryParams = [userId];
      let placeholderIndex = queryParams.length + 1;

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

        const placeholders = values.map(() => `$${placeholderIndex++}`).join(", ");
        conditions.push(`${formattedKey} IN (${placeholders})`);

        queryParams.push(...values);
      }

      // WHERE created_at >= startDate AND created_at <= endDate


      // TODO - can query params just have the raw date object?? i think so...
      // Note - zod ensures that dateRange[0] <= dateRange[1]
      const datePlaceholders: [number, number] = ["", ""];
      if (dateRange[0]) {
        queryParams.push(dateRange[0].toISOString());
        conditions.push(`ce.created_at >= $${placeholderIndex}`);
        datePlaceholders[0] = placeholderIndex++;
      }

      queryParams.push(dateRange[1].toISOString());
      conditions.push(`ce.created_at <= $${placeholderIndex}`);
      datePlaceholders[1] = placeholderIndex++;

      if (queryString && queryField) {
        conditions.push(`${queryField} ILIKE '%' || $${placeholderIndex++} || '%'`);
        queryParams.push(queryString);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      const testquery = `
        WITH filtered_clicks AS (
          SELECT
            ce.source AS source,
            ce.city AS city,
            ce.country AS country,
            ce.region AS region,
            ce.continent AS continent,
            user_links.short_url AS short_url,
            user_links.original_url AS original_url,
            ce.created_at AS created_at,
            ce.browser AS browser,
            ce.device AS device,
            ce.os AS os
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
        ),
        total_count AS (
          SELECT COUNT(*) AS total FROM filtered_clicks
        )

        SELECT json_build_object(
          'source', (
            SELECT coalesce(json_agg(t), '[]'::json)
            FROM (
              SELECT source::TEXT AS value, 'source:' || source::TEXT AS label, COUNT(*) AS count, (COUNT(*) * 100.0 / (SELECT total FROM total_count)) AS percent
              FROM filtered_clicks
              GROUP BY source
              ORDER BY count DESC, value
              LIMIT $${placeholderIndex}
            ) t
          ),
          'country', (
            SELECT coalesce(json_agg(t), '[]'::json)
            FROM (
              SELECT country::TEXT AS value, 'source:' || country::TEXT AS label, COUNT(*) AS count, (COUNT(*) * 100.0 / (SELECT total FROM total_count)) AS percent
              FROM filtered_clicks
              GROUP BY country
              ORDER BY count DESC, value
              LIMIT $${placeholderIndex}
            ) t
          ),
          'region', (
            SELECT coalesce(json_agg(t), '[]'::json)
            FROM (
              SELECT region::TEXT AS value, 'source:' || region::TEXT AS label, COUNT(*) AS count, (COUNT(*) * 100.0 / (SELECT total FROM total_count)) AS percent
              FROM filtered_clicks
              GROUP BY region
              ORDER BY count DESC, value
              LIMIT $${placeholderIndex}
            ) t
          ),
          'continent', (
            SELECT coalesce(json_agg(t), '[]'::json)
            FROM (
              SELECT continent::TEXT AS value, 'source:' || continent::TEXT AS label, COUNT(*) AS count, (COUNT(*) * 100.0 / (SELECT total FROM total_count)) AS percent
              FROM filtered_clicks
              GROUP BY continent
              ORDER BY count DESC, value
              LIMIT $${placeholderIndex}
            ) t
          ),
          'city', (
            SELECT coalesce(json_agg(t), '[]'::json)
            FROM (
              SELECT city::TEXT AS value, 'source:' || city::TEXT AS label, COUNT(*) AS count, (COUNT(*) * 100.0 / (SELECT total FROM total_count)) AS percent
              FROM filtered_clicks
              GROUP BY city
              ORDER BY count DESC, value
              LIMIT $${placeholderIndex}
            ) t
          ),
          'short_url', (
            SELECT coalesce(json_agg(t), '[]'::json)
            FROM (
              SELECT short_url::TEXT AS value, 'source:' || short_url::TEXT AS label, COUNT(*) AS count, (COUNT(*) * 100.0 / (SELECT total FROM total_count)) AS percent
              FROM filtered_clicks
              GROUP BY short_url
              ORDER BY count DESC, value
              LIMIT $${placeholderIndex}
            ) t
          ),
          'original_url', (
            SELECT coalesce(json_agg(t), '[]'::json)
            FROM (
              SELECT original_url::TEXT AS value, 'source:' || original_url::TEXT AS label, COUNT(*) AS count, (COUNT(*) * 100.0 / (SELECT total FROM total_count)) AS percent
              FROM filtered_clicks
              GROUP BY original_url
              ORDER BY count DESC, value
              LIMIT $${placeholderIndex}
            ) t
          ),
          'browser', (
            SELECT coalesce(json_agg(t), '[]'::json)
            FROM (
              SELECT browser::TEXT AS value, 'source:' || browser::TEXT AS label, COUNT(*) AS count, (COUNT(*) * 100.0 / (SELECT total FROM total_count)) AS percent
              FROM filtered_clicks
              GROUP BY browser
              ORDER BY count DESC, value
              LIMIT $${placeholderIndex}
            ) t
          ),
          'device', (
            SELECT coalesce(json_agg(t), '[]'::json)
            FROM (
              SELECT device::TEXT AS value, 'source:' || device::TEXT AS label, COUNT(*) AS count, (COUNT(*) * 100.0 / (SELECT total FROM total_count)) AS percent
              FROM filtered_clicks
              GROUP BY device
              ORDER BY count DESC, value
              LIMIT $${placeholderIndex}
            ) t
          ),
          'os', (
            SELECT coalesce(json_agg(t), '[]'::json)
            FROM (
              SELECT os::TEXT AS value, 'source:' || os::TEXT AS label, COUNT(*) AS count, (COUNT(*) * 100.0 / (SELECT total FROM total_count)) AS percent
              FROM filtered_clicks
              GROUP BY os
              ORDER BY count DESC, value
              LIMIT $${placeholderIndex}
            ) t
          )
        ) AS results;
      `;

      /*

      ,
          'chart', (
            SELECT coalesce(json_agg(t), '[]'::json)
            FROM (
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
              GROUP BY date
              ORDER BY date DESC
            ) t
          ),
          'extra', (
            SELECT coalesce(json_agg(t), '[]'::json)
            FROM (
              SELECT (MAX(created_at)::date - MIN(created_at)::date) AS num_days
              FROM filtered_clicks
            ) t
          )

      */

      /**
       *
       * If dateRange[0] === undefind → AllTime query → used dateRange[1] in the WHERE
       * but for the interval get the first and last click in that window
       *
       * If dateRange[1] !== undefined → LastNQuery → use dateRange[0] and dateRange[1] in WHERE
       * and use dateRange[0] and dateRange[1] to compute interval
       *
       */

      let charQuery = "";
      if (dateRange[0] === undefined) {
        // console.log("alltime", dateRange)
        charQuery = `
        WITH user_links AS (
          SELECT id, original_url, short_url
          FROM links
          WHERE user_id = $1
        ),
        filtered_clicks AS (
          SELECT ce.*, ul.short_url, ul.original_url
          FROM click_events AS ce
          JOIN user_links AS ul ON ul.id = ce.link_id
          ${whereClause}
        ),
        date_range AS (
          SELECT
            (MAX(created_at)::date - MIN(created_at)::date) AS num_days,
            MIN(created_at) AS start_date,
            MAX(created_at) AS end_date
          FROM filtered_clicks
        ),
        interval AS (
          SELECT
            CASE
              WHEN num_days <= 2 THEN INTERVAL '1 hour'
              WHEN num_days <= 4  THEN INTERVAL '6 hours'
              WHEN num_days <= 30  THEN INTERVAL '1 day'
              WHEN num_days <= 90  THEN INTERVAL '3 days'
              WHEN num_days <= 180  THEN INTERVAL '1 week'
              WHEN num_days <= 1460  THEN INTERVAL '1 month'
              ELSE INTERVAL '1 year'
            END AS interval
          FROM date_range
        ),
        time_events AS (
          SELECT *
          FROM date_range
          CROSS JOIN interval
        ),
        array_of_buckets AS (
          SELECT ARRAY_AGG(series) AS buckets
            FROM generate_series(
            (SELECT start_date FROM time_events)::date,
            (SELECT end_date FROM time_events)::date,
            (SELECT interval FROM time_events)
          ) AS series
        ),
        bucketed_clicks AS (
          SELECT
            WIDTH_BUCKET(created_at, array_of_buckets.buckets) AS bucket_number,
            SUM(CASE WHEN fc.source = 'qr' THEN 1 ELSE 0 END) AS qr_count,
            SUM(CASE WHEN fc.source = 'link' THEN 1 ELSE 0 END) AS link_count
          FROM filtered_clicks AS fc
          CROSS JOIN array_of_buckets
          GROUP BY bucket_number
        )

        SELECT buckets_with_dates.date, COALESCE(qr_count, 0) AS qr_count, COALESCE(link_count, 0) AS link_count
        FROM array_of_buckets
        CROSS JOIN UNNEST(buckets) WITH ORDINALITY AS buckets_with_dates(date, bucket_number)
        LEFT JOIN bucketed_clicks ON buckets_with_dates.bucket_number = bucketed_clicks.bucket_number
        ORDER BY date DESC;
      `;
      } else {
        // console.log("lastN", dateRange)
        charQuery = `
          WITH user_links AS (
            SELECT id, original_url, short_url
            FROM links
            WHERE user_id = $1
          ),
          filtered_clicks AS (
            SELECT ce.*, ul.short_url, ul.original_url
            FROM click_events AS ce
            JOIN user_links AS ul ON ul.id = ce.link_id
            ${whereClause}
          ),
          date_range AS (
            SELECT
              (MAX($${datePlaceholders[1]})::date - MIN($${datePlaceholders[0]})::date) AS num_days,
              MIN($${datePlaceholders[0]}) AS start_date,
              MAX($${datePlaceholders[1]}) AS end_date
            FROM filtered_clicks
          ),
          interval AS (
            SELECT
              CASE
                WHEN num_days <= 2 THEN INTERVAL '1 hour'
                WHEN num_days <= 4  THEN INTERVAL '6 hours'
                WHEN num_days <= 30  THEN INTERVAL '1 day'
                WHEN num_days <= 90  THEN INTERVAL '3 days'
                WHEN num_days <= 180  THEN INTERVAL '1 week'
                WHEN num_days <= 1460  THEN INTERVAL '1 month'
                ELSE INTERVAL '1 year'
              END AS interval
            FROM date_range
          ),
          time_events AS (
            SELECT *
            FROM date_range
            CROSS JOIN interval
          ),
          array_of_buckets AS (
            SELECT ARRAY_AGG(series) AS buckets
              FROM generate_series(
              (SELECT start_date FROM time_events)::date,
              (SELECT end_date FROM time_events)::date,
              (SELECT interval FROM time_events)
            ) AS series
          ),
          bucketed_clicks AS (
            SELECT
              WIDTH_BUCKET(created_at, array_of_buckets.buckets) AS bucket_number,
              SUM(CASE WHEN fc.source = 'qr' THEN 1 ELSE 0 END) AS qr_count,
              SUM(CASE WHEN fc.source = 'link' THEN 1 ELSE 0 END) AS link_count
            FROM filtered_clicks AS fc
            CROSS JOIN array_of_buckets
            GROUP BY bucket_number
          )

          SELECT buckets_with_dates.date, COALESCE(qr_count, 0) AS qr_count, COALESCE(link_count, 0) AS link_count
          FROM array_of_buckets
          CROSS JOIN UNNEST(buckets) WITH ORDINALITY AS buckets_with_dates(date, bucket_number)
          LEFT JOIN bucketed_clicks ON buckets_with_dates.bucket_number = bucketed_clicks.bucket_number
          ORDER BY date DESC;
        `;
      }

      /*

      SELECT
          date_trunc(
            CASE
              WHEN (SELECT * num_days FROM date_range) > 365 THEN 'month'
              ELSE 'day'
            END
          ) AS date,
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
        GROUP BY date
        ORDER BY date DESC;

      TODO
      I am not yet sure if these queries will be done by PG or maybe Redis.
      But if it ends up being PG, then these 2 queries should be combined into one.
      This will require changing the Zod schemas...

      */

      const testResponse: QueryResponse = await sql(testquery, [...queryParams, LIMIT]);
      // console.log((testResponse[0]?.results?.extra) as any)
      const testResult = parseJSONQueryResponse(testResponse, ClickEventSchemas.JSONAgg);

      // const response: QueryResponse = await sql(query, queryParams);
      // const result = parseQueryResponse(response, ClickEventSchemas.Filter, ["field"]);

      // console.log(lastNDaysQuery)
      // console.log(queryParams)
      const response2: QueryResponse = await sql(charQuery, queryParams);
      // console.log(response2);
      const result2 = parseQueryResponse(response2, ClickEventSchemas.Chart);

      // TODO
      // I am not 100% that this is correct.
      // If there is no click data, what is the result?
      // if (result.length !== 1) throw new Error();

      return ServerResponse.success({ chart: result2, json: testResult });

    } catch (error: unknown) {
      console.log({ error })
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
}
