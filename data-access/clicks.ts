import "server-only";

import { env } from "@/data-access/env";
import { neon } from '@neondatabase/serverless';
import { ZodError } from 'zod';
import { parseQueryResponse, type QueryResponse } from "@/utils/helper";
import {
  ClickPayloadSchema,
  ComboboxEntrySchema,
  AnalyticsReadSchema,
  type ClickPayload,
  type AnalyticsRead,
  type ComboboxPage,
} from "@/lib/zod/clicks";
import { LinkSchemas, LinkTypes, OriginalUrlSchema, OriginalUrlSchemaType, QueryGetAllSchema } from "@/lib/zod/links";
import { snakeCase } from "change-case";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { ServerResponse, ServerResponseType } from "@/lib/server-repsonse";
import { sql as localSQL } from "./local-connect-test";
import { Click, ClickEventSchema } from "@/lib/schemas/click/click.entity";

const sql = env.ENV === "dev" ? localSQL : neon(env.DATABASE_URL);

/**
 * Data-Access-Layer (DAL) for all ClickEvents
 */
export class ClickEvents {

  // static async recordClickagian(params: ClickPayload): Promise<ServerResponseType<OriginalUrlSchemaType>> {
  //   try {
  //     const tableData = ClickPayloadSchema.parse(params);

  //     const columns = Object.keys(tableData);
  //     const placeholders = columns.map((_, i) => `$${i+1}`).join(", ");
  //     const values = Object.values(tableData);

  //     const newQuery = `
  //       INSERT INTO click_events(${columns})
  //       VALUES (${placeholders})
  //     `;

  //     const query = `
  //       WITH matching_link AS (
  //         SELECT id, original_url
  //         FROM links
  //         WHERE code = $1
  //       ),
  //       click_cte AS (
  //         INSERT INTO click_events(link_id, ${columns})
  //         SELECT id, ${placeholders}
  //         FROM matching_link
  //       )

  //       SELECT original_url
  //       FROM matching_link;
  //     `;

  //     const response: QueryResponse = await sql(query, [code, ...values]);
  //     const result = parseQueryResponse(response, OriginalUrlSchema);

  //     if (result.length === 0) return ServerResponse.fail(ERROR_MESSAGES.NOT_FOUND);

  //     return ServerResponse.success(result[0]);

  //   } catch (error: unknown) {
  //     console.error(error);
  //     if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
  //     return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
  //   }
  // }

  static async recordClick(params: unknown): Promise<ServerResponseType<Click>> {
    try {
      console.log({params})
      const tableData = ClickPayloadSchema.parse(params);
      tableData

      const columns = Object.keys(tableData);
      const placeholders = columns.map((_, i) => `$${i+1}`).join(", ");
      const values = Object.values(tableData);

      const query = `
        INSERT INTO click_events (${columns})
        VALUES (${placeholders})
        RETURNING *;
      `;

      const response: QueryResponse = await sql(query, values);
      const result = parseQueryResponse(response, ClickEventSchema);

      if (result.length !== 1) return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);

      return ServerResponse.success(result[0]);

    } catch (error: unknown) {
      console.log(error);
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  static async getQueriedData(params: LinkTypes.GetAll): Promise<ServerResponseType<ComboboxPage>> {
    try {
      const { userId, options, dateRange, queryString, queryField } = QueryGetAllSchema.parse(params);

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
        conditions.push(`created_at >= $${placeholderIndex++}`);
      }

      if (dateRange[1]) {
        queryParams.push(dateRange[1].toISOString());
        conditions.push(`created_at <= $${placeholderIndex++}`);
      }

      queryParams.push(queryString);
      let snakeCaseQueryField = snakeCase(queryField);

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      const query = `
        WITH user_links AS (
          SELECT *
          FROM links
          WHERE user_id = $1
        ),
        unfiltered_clicks AS (
          SELECT
            user_links.id 				    AS link_id,
            ce.id 						        AS click_id,
            ce.source 					      AS source,
            ce.city 					        AS city,
            ce.country 					      AS country,
            ce.region 					      AS region,
            ce.continent 				      AS continent,
            user_links.short_url 		  AS short_url,
            user_links.original_url 	AS original_url,
            ce.created_at 				    AS created_at,
            ce.browser 					      AS browser,
            ce.device 					      AS device,
            ce.os 						        AS os
          FROM click_events AS ce
          JOIN user_links ON user_links.id = ce.link_id
        ),
        search_countries AS (
          SELECT DISTINCT ${snakeCaseQueryField}
          FROM unfiltered_clicks
          WHERE ${snakeCaseQueryField} ILIKE '%' || $${placeholderIndex++} || '%'
        ),
        filtered_counts AS (
          SELECT
            ${snakeCaseQueryField},
            COUNT(*) AS count
          FROM unfiltered_clicks
          ${whereClause}
          GROUP BY ${snakeCaseQueryField}
        )

        SELECT
          sc.${snakeCaseQueryField}                 AS value,
          '${snakeCaseQueryField}:' || sc.${snakeCaseQueryField}   AS label,
          COALESCE(fc.count, 0)      AS count
        FROM search_countries AS sc
        LEFT JOIN filtered_counts AS fc ON fc.${snakeCaseQueryField} = sc.${snakeCaseQueryField}
        ORDER BY count DESC, sc.${snakeCaseQueryField}
        LIMIT 50;
        `;

      const response: QueryResponse = await sql(query, [...queryParams]);

      const result = parseQueryResponse(response, ComboboxEntrySchema);
      return ServerResponse.success(result);

    } catch (error: unknown) {
      console.log({ error })
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  static async getFilteredData(params: LinkTypes.GetAll): Promise<ServerResponseType<AnalyticsRead>> {
    try {
      const { userId, options, dateRange } = LinkSchemas.GetAll.parse(params);

      const queryParams = [userId];
      let placeholderIndex = queryParams.length + 1;

      const placeholderMap = new Map<string, string>();
      for (let [key, values] of options) {
        if (values.length === 0) continue;
        const formattedKey = snakeCase(key);

        const placeholders = values.map(() => `$${placeholderIndex++}`).join(", ");
        placeholderMap.set(formattedKey, `${formattedKey} IN (${placeholders})`);

        // const cleanValues = values.map((val) => val === 'unknown' ?)
        queryParams.push(...values);
      }

      /*
      TODO - Major issue
      Zod allows for the date range to be of type [Date | undefined, Date | undefined].
      I had not initially intended for this, but have since changed my mind so that
      future API can be more flexible.
      Because of that, the following logic for generating the query fails
      also, we can pass nothing and get really incrorrect data.
      a temporary pause here is I am goign to throw an error if
      not in the old format
      */
      if (dateRange[1] === undefined) throw new Error('temp workaround, pass an end date for now');

      const datePlaceholders: [number, number] = [-1, -1];
      const dateConditions = [];
      if (dateRange[0]) {
        queryParams.push(dateRange[0].toISOString());
        dateConditions.push(`created_at >= $${placeholderIndex}`);
        datePlaceholders[0] = placeholderIndex++;
      }

      if (dateRange[1]) {
        queryParams.push(dateRange[1].toISOString());
        dateConditions.push(`created_at <= $${placeholderIndex}`);
        datePlaceholders[1] = placeholderIndex++;
      }

      function makeWhereClause(placeholderMap: Map<string, string>, dateConditions: string[], negateFilters: boolean = false, excludedField?: string) {
        const conditions = [];
        for (const [field, condition] of placeholderMap) {
          if (excludedField && (field === excludedField)) continue;
          conditions.push(condition);
        }

        if (conditions.length === 0) {
          if (dateConditions.length > 0) return `WHERE ${dateConditions.join(" AND ")}`;
          return "";
        }

        if (negateFilters) {
          if (dateConditions.length > 0) return `WHERE NOT(${conditions.join(" AND ")}) AND ${dateConditions.join(" AND ")}`;
          return `WHERE NOT(${conditions.join(" AND ")})`;
        } else {
          if (dateConditions.length > 0) return `WHERE ${conditions.join(" AND ")} AND ${dateConditions.join(" AND ")}`;
          return `WHERE ${conditions.join(" AND ")}`;
        }
      }

      const fields = ["source", "continent", "country", "city", "region", "original_url", "short_url", "browser", "device", "os"];
      const tabsQuery = [];
      const comboboxQuery = [];
      for (const field of fields) {

        tabsQuery.push(`
            '${field}', (
              SELECT coalesce(json_agg(row), '[]'::json)
              FROM (
                SELECT
                  ${field}::TEXT AS value,
                  '${field}:' || ${field}::TEXT AS label,
                  COUNT(*) AS count,
                  (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM filtered_clicks)) AS percent
                FROM filtered_clicks
                GROUP BY ${field}
                ORDER BY count DESC, value
                LIMIT 50
              ) AS row
            )`
          );

        comboboxQuery.push(`
            '${field}', (
              SELECT COALESCE(
                json_agg(
                  json_build_object('value', row.value, 'label', row.label, 'count', row.count)
                  ORDER BY row.matched DESC, row.order_count DESC, row.value
                ),
                '[]'::json
              )
              FROM (
                SELECT * FROM (
                  SELECT
                    ${field}::TEXT AS value,
                    '${field}:' || ${field}::TEXT AS label,
                    COUNT(*) FILTER (${makeWhereClause(placeholderMap, dateConditions, false, field)}) AS count,
                    1 AS matched,
                    COUNT(*) AS order_count
                  FROM unfiltered_clicks
                  GROUP BY ${field}
                  HAVING COUNT(*) FILTER (${makeWhereClause(placeholderMap, dateConditions, false, field)}) > 0

                  UNION ALL

                  SELECT
                    ${field}::TEXT AS value,
                    '${field}:' || ${field}::TEXT AS label,
                    0 AS count,
                    0 AS matched,
                    COUNT(*) AS order_count
                  FROM unfiltered_clicks
                  GROUP BY ${field}
                  HAVING COUNT(*) FILTER (${makeWhereClause(placeholderMap, dateConditions, false, field)}) = 0
                ) AS unioned
                ORDER BY matched DESC, order_count DESC, value
                LIMIT 50
              ) AS row
            )`
        );
      }

      const newQuery = `
        WITH user_links AS (
          SELECT *
          FROM links
          WHERE user_id = $1
        ),
        unfiltered_clicks AS (
          SELECT
            user_links.id 				    AS link_id,
            ce.id 						        AS click_id,
            ce.source 					      AS source,
            ce.city 					        AS city,
            ce.country 					      AS country,
            ce.region 					      AS region,
            ce.continent 				      AS continent,
            user_links.short_url 		  AS short_url,
            user_links.original_url 	AS original_url,
            ce.created_at 				    AS created_at,
            ce.browser 					      AS browser,
            ce.device 					      AS device,
            ce.os 						        AS os
          FROM click_events AS ce
          JOIN user_links ON user_links.id = ce.link_id
        ),
        filtered_clicks AS (
          SELECT *
          FROM unfiltered_clicks
          ${makeWhereClause(placeholderMap, dateConditions)}
        ),
        date_range AS (
          ${dateRange[0] === undefined ?
            `SELECT
              (MAX(created_at)::date - MIN(created_at)::date) AS num_days,
              MIN(created_at) AS start_date,
              MAX(created_at) AS end_date
            FROM filtered_clicks`
            :
            `SELECT
              (MAX($${datePlaceholders[1]})::date - MIN($${datePlaceholders[0]})::date) AS num_days,
              MIN($${datePlaceholders[0]}) AS start_date,
              MAX($${datePlaceholders[1]}) AS end_date
            FROM filtered_clicks`
          }
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

        SELECT json_build_object(
          'empty', (SELECT COUNT(*) > 0 FROM unfiltered_clicks),
          'tabs', json_build_object(
              ${tabsQuery.join(",")}
          ),
          'stats', json_build_object(
            'num_links', (SELECT COUNT(DISTINCT short_url) FROM filtered_clicks),
            'link_clicks', (SELECT COUNT(*) FROM filtered_clicks WHERE source = 'link'),
            'qr_clicks', (SELECT COUNT(*) FROM filtered_clicks WHERE source = 'qr')
          ),
          'combobox', json_build_object(
            ${comboboxQuery.join(",")}
          ),
          'chart', (
            SELECT
              COALESCE(
                json_agg(
                  json_build_object(
                    'date',       buckets_with_dates.date,
                    'qr_count',   COALESCE(bucketed_clicks.qr_count, 0),
                    'link_count', COALESCE(bucketed_clicks.link_count, 0)
                  )
                  ORDER BY buckets_with_dates.date DESC
                ),
                '[]'::json
              ) AS chart_array
            FROM array_of_buckets
            CROSS JOIN UNNEST(buckets) WITH ORDINALITY
              AS buckets_with_dates(date, bucket_number)
            LEFT JOIN bucketed_clicks
              ON buckets_with_dates.bucket_number = bucketed_clicks.bucket_number
          )
        ) AS data;
      `;

      const response: QueryResponse = await sql(newQuery, [...queryParams]);
      const validatedResponse = AnalyticsReadSchema.parse(response);
      return ServerResponse.success(validatedResponse);

      /**
       *
       * If dateRange[0] === undefind → AllTime query → used dateRange[1] in the WHERE
       * but for the interval get the first and last click in that window
       *
       * If dateRange[1] !== undefined → LastNQuery → use dateRange[0] and dateRange[1] in WHERE
       * and use dateRange[0] and dateRange[1] to compute interval
       *
       */


    } catch (error: unknown) {
      console.log({ error })
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
}
