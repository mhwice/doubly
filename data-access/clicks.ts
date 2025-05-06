import "server-only";

import { env } from "@/data-access/env";
import { neon } from '@neondatabase/serverless';
import { ZodError } from 'zod';
import { parseJSONQueryResponse, parseQueryResponse, type QueryResponse } from "@/utils/helper";
import { ClickEventSchemas, ComboboxJSONEntitySchema, ComboboxQuery, RecordClickIfExistsSchema, RecordClickIfExistsSchemaType, type ClickEventTypes } from "@/lib/zod/clicks";
import { LinkSchemas, LinkTypes, OriginalUrlSchema, OriginalUrlSchemaType, QueryGetAllSchema } from "@/lib/zod/links";
import { snakeCase } from "change-case";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { ServerResponse, ServerResponseType } from "@/lib/server-repsonse";
import { sql as localSQL } from "./local-connect-test";

const sql = env.ENV === "dev" ? localSQL : neon(env.DATABASE_URL);

/**
 * Data-Access-Layer (DAL) for all ClickEvents
 */
export class ClickEvents {

  static async recordClickIfExists(params: Partial<RecordClickIfExistsSchemaType>): Promise<ServerResponseType<OriginalUrlSchemaType>> {
    try {
      const tableData = RecordClickIfExistsSchema.parse(params);

      let code = "";
      let pairs = new Map<string, string | number>();
      for (const [k, v] of Object.entries(tableData)) {
        if (k === "code") {
          if (typeof v === "string") code = v;
          else return ServerResponse.fail(ERROR_MESSAGES.NOT_FOUND);
        } else {
          pairs.set(k, v);
        }
      }

      const columns = Array.from(pairs.keys());
      const placeholders = columns.map((_, i) => `$${i+2}`).join(", ");
      const values = Array.from(pairs.values());

      const query = `
        WITH matching_link AS (
          SELECT id, original_url
          FROM links
          WHERE code = $1
        ),
        click_cte AS (
          INSERT INTO click_events(link_id, ${columns})
          SELECT id, ${placeholders}
          FROM matching_link
        )

        SELECT original_url
        FROM matching_link;
      `;

      // console.log({query})
      const response: QueryResponse = await sql(query, [code, ...values]);
      // console.log({response})
      const result = parseQueryResponse(response, OriginalUrlSchema);
      // console.log({result});

      if (result.length === 0) return ServerResponse.fail(ERROR_MESSAGES.NOT_FOUND);

      return ServerResponse.success(result[0]);

    } catch (error: unknown) {
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

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

  /*
    Given some filter criteria, we need to return all of the unique items and their count, so we can
    use this in combobox filter.

    To start, lets apply no filters, and simply return all of the data for all clicks.

    So I want:

    source: [link, qr],
    country: [cananda, mexicon, italy, ...],
    continent: [europe, south america, ...],

  */

  /*

    So we get all of these params, and what do we want to do with them?
    We want to get the unfilited_clicks and then perform the text search.
    This gives us up to 50 items that match the text search. Then we want to set their count based on how
    many rows have that.

  */
  static async getQueriedData(params: LinkTypes.GetAll): Promise<ServerResponseType<ComboboxQuery[]>> {
    try {
      const { userId, options, dateRange, queryString, queryField } = QueryGetAllSchema.parse(params);

      "50";

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

      // console.log(query);
      // console.log(queryParams);
      const response: QueryResponse = await sql(query, [...queryParams]);

      const result = parseQueryResponse(response, ComboboxJSONEntitySchema);
      // console.log('combo',result)
      return ServerResponse.success(result);


      // const LIMIT = "50";

      // const conditions = [];
      // const queryParams = [userId];
      // let placeholderIndex = queryParams.length + 1;

      // for (let [key, values] of options) {
      //   if (values.length === 0) continue;
      //   const formattedKey = snakeCase(key);

      //   const placeholders = values.map(() => `$${placeholderIndex++}`).join(", ");
      //   conditions.push(`${formattedKey} IN (${placeholders})`);

      //   queryParams.push(...values);
      // }

      // if (dateRange[0]) {
      //   queryParams.push(dateRange[0].toISOString());
      //   conditions.push(`ce.created_at >= $${placeholderIndex++}`);
      // }

      // if (dateRange[1]) {
      //   queryParams.push(dateRange[1].toISOString());
      //   conditions.push(`ce.created_at <= $${placeholderIndex++}`);
      // }

      // if (queryString && queryField) {
      //   conditions.push(`${snakeCase(queryField)} ILIKE '%' || $${placeholderIndex++} || '%'`);
      //   queryParams.push(queryString);
      // }

      // const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      // const testquery = `
      //   WITH filtered_clicks AS (
      //     SELECT
      //       user_links.id AS id,
      //       ce.source AS source,
      //       ce.city AS city,
      //       ce.country AS country,
      //       ce.region AS region,
      //       ce.continent AS continent,
      //       user_links.short_url AS short_url,
      //       user_links.original_url AS original_url,
      //       ce.created_at AS created_at,
      //       ce.browser AS browser,
      //       ce.device AS device,
      //       ce.os AS os
      //     FROM click_events AS ce
      //     JOIN (
      //       SELECT *
      //       FROM links
      //       -- TODO, if I filter our short_url and original_url here, then this becomes more efficient
      //       -- as we aren't doing a join on as many records, and the subsequent steps are faster
      //       WHERE user_id = $1
      //     ) AS user_links ON user_links.id = ce.link_id
      //     -- WHERE source IN ('qr') AND country IN ('CA', 'RO')
      //     ${whereClause}
      //   ),
      //   total_count AS (
      //     SELECT COUNT(*) AS total FROM filtered_clicks
      //   )

      //   SELECT ${queryField}::TEXT AS value, '${queryField}:' || ${queryField} AS label, COUNT(*) AS count, (COUNT(*) * 100.0 / (SELECT total FROM total_count)) AS percent
      //   FROM filtered_clicks
      //   GROUP BY ${queryField}
      //   ORDER BY count DESC, value
      //   LIMIT $${placeholderIndex}
      // `;


      // const testResponse: QueryResponse = await sql(testquery, [...queryParams, LIMIT]);
      // console.log(testResponse)
      // const testResult = parseQueryResponse(testResponse, ClickEventSchemas.Query);

      // return ServerResponse.success(testResult);

    } catch (error: unknown) {
      console.log({ error })
      if (error instanceof ZodError) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
      return ServerResponse.fail(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  static async getFilteredData(params: LinkTypes.GetAll): Promise<ServerResponseType<ClickEventTypes.AnalyticsJSON>> {
    try {
      const { userId, options, dateRange } = LinkSchemas.GetAll.parse(params);

      const LIMIT = "50";

      // const conditions = [];
      const queryParams = [userId];
      let placeholderIndex = queryParams.length + 1;

      /*

      placeholderMap = {
        source: ["$2", "$3"],
        continent: ["$4"],
        country: "$5, $6, $7",
        ...
      }

      */

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

      function hasNegativeWhereClause(placeholderMap: Map<string, string>, excludedField: string) {
        const conditions = [];
        for (const [field, condition] of placeholderMap) {
          if (excludedField && (field === excludedField)) continue;
          conditions.push(condition);
        }

        /*

        WHERE country in (CA, MX, FR) and continent in (NA)

        */

        return conditions.length > 0;
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

      // const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      /*
              STRATEGY

              Create a single query for each piece of place I need data.
              1. StatsHeader (statsHeaderQuery)
                 We need the total number of short_urls after all filters applied (not limited)
                 We need the total number of link clicks after all filters applied (not limited)
                 We need the total number of qr clicks after all filters applied (not limited)
              2. Chart
                 This is already done (chartQuery)
              3. TabGroup
                 This is already done (jsonQuery)
              4. Combobox

                 This is similar to jsonQuery, but we handle the WHERE a bit differently.
                 Say our filters are continent:{na, eu} and country:{fr, ca}

                 Then for the 'continent' propety on the json, we don't apply the continent filters,
                 but we still apply all other filters.

      */

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
          'tabs', json_build_object(
            'source', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  source::TEXT AS value,
                  'source:' || source::TEXT AS label,
                  COUNT(*) AS count,
                  (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM filtered_clicks)) AS percent
                FROM filtered_clicks
                GROUP BY source
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'country', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  country::TEXT AS value,
                  'country:' || country::TEXT AS label,
                  COUNT(*) AS count,
                  (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM filtered_clicks)) AS percent
                FROM filtered_clicks
                GROUP BY country
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'region', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  region::TEXT AS value,
                  'region:' || region::TEXT AS label,
                  COUNT(*) AS count,
                  (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM filtered_clicks)) AS percent
                FROM filtered_clicks
                GROUP BY region
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'continent', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  continent::TEXT AS value,
                  'continent:' || continent::TEXT AS label,
                  COUNT(*) AS count,
                  (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM filtered_clicks)) AS percent
                FROM filtered_clicks
                GROUP BY continent
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'city', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  city::TEXT AS value,
                  'city:' || city::TEXT AS label,
                  COUNT(*) AS count,
                  (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM filtered_clicks)) AS percent
                FROM filtered_clicks
                GROUP BY city
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'short_url', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  short_url::TEXT AS value,
                  'short_url:' || short_url::TEXT AS label,
                  COUNT(*) AS count,
                  (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM filtered_clicks)) AS percent
                FROM filtered_clicks
                GROUP BY short_url
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'original_url', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  original_url::TEXT AS value,
                  'original_url:' || original_url::TEXT AS label,
                  COUNT(*) AS count,
                  (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM filtered_clicks)) AS percent
                FROM filtered_clicks
                GROUP BY original_url
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'browser', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  browser::TEXT AS value,
                  'browser:' || browser::TEXT AS label,
                  COUNT(*) AS count,
                  (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM filtered_clicks)) AS percent
                FROM filtered_clicks
                GROUP BY browser
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'device', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  device::TEXT AS value,
                  'device:' || device::TEXT AS label,
                  COUNT(*) AS count,
                  (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM filtered_clicks)) AS percent
                FROM filtered_clicks
                GROUP BY device
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'os', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  os::TEXT AS value,
                  'os:' || os::TEXT AS label,
                  COUNT(*) AS count,
                  (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM filtered_clicks)) AS percent
                FROM filtered_clicks
                GROUP BY os
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            )
          ),
          'stats', json_build_object(
            'num_links', (SELECT COUNT(*) FROM user_links),
            'link_clicks', (SELECT COUNT(*) FROM filtered_clicks WHERE source = 'link'),
            'qr_clicks', (SELECT COUNT(*) FROM filtered_clicks WHERE source = 'qr')
          ),
          'combobox', json_build_object(
            'source', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  source::TEXT AS value,
                  'source:' || source::TEXT AS label,
                  COUNT(*) AS count
                FROM unfiltered_clicks
                ${makeWhereClause(placeholderMap, dateConditions, false, "source")}
                GROUP BY source
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'country', (
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
                    country::TEXT AS value,
                    'country:' || country::TEXT AS label,
                    COUNT(*) AS count,
                    1 AS matched,
                    COUNT(*) AS order_count
                  FROM unfiltered_clicks
                  ${makeWhereClause(placeholderMap, dateConditions, false, "country")}
                  GROUP BY country

                  UNION ALL

                  SELECT
                    country::TEXT AS value,
                    'country:' || country::TEXT AS label,
                    0 AS count,
                    0 AS matched,
                    COUNT(*) AS order_count
                  FROM unfiltered_clicks
                  ${makeWhereClause(placeholderMap, dateConditions, true, "country")}
                  GROUP BY country
                ) AS unioned
                ORDER BY matched DESC, order_count DESC, value
                LIMIT 50
              ) AS row
            ),
            'region', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  region::TEXT AS value,
                  'region:' || region::TEXT AS label,
                  COUNT(*) AS count
                FROM unfiltered_clicks
                ${makeWhereClause(placeholderMap, dateConditions, false, "region")}
                GROUP BY region
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'continent', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  continent::TEXT AS value,
                  'continent:' || continent::TEXT AS label,
                  COUNT(*) AS count
                FROM unfiltered_clicks
                ${makeWhereClause(placeholderMap, dateConditions, false, "continent")}
                GROUP BY continent
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'city', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  city::TEXT AS value,
                  'city:' || city::TEXT AS label,
                  COUNT(*) AS count
                FROM unfiltered_clicks
                ${makeWhereClause(placeholderMap, dateConditions, false, "city")}
                GROUP BY city
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'short_url', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  short_url::TEXT AS value,
                  'short_url:' || short_url::TEXT AS label,
                  COUNT(*) AS count
                FROM unfiltered_clicks
                ${makeWhereClause(placeholderMap, dateConditions, false, "short_url")}
                GROUP BY short_url
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'original_url', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  original_url::TEXT AS value,
                  'original_url:' || original_url::TEXT AS label,
                  COUNT(*) AS count
                FROM unfiltered_clicks
                ${makeWhereClause(placeholderMap, dateConditions, false, "original_url")}
                GROUP BY original_url
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'browser', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  browser::TEXT AS value,
                  'browser:' || browser::TEXT AS label,
                  COUNT(*) AS count
                FROM unfiltered_clicks
                ${makeWhereClause(placeholderMap, dateConditions, false, "browser")}
                GROUP BY browser
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'device', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  device::TEXT AS value,
                  'device:' || device::TEXT AS label,
                  COUNT(*) AS count
                FROM unfiltered_clicks
                ${makeWhereClause(placeholderMap, dateConditions, false, "device")}
                GROUP BY device
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            ),
            'os', (
              SELECT coalesce(json_agg(t), '[]'::json)
              FROM (
                SELECT
                  os::TEXT AS value,
                  'os:' || os::TEXT AS label,
                  COUNT(*) AS count
                FROM unfiltered_clicks
                ${makeWhereClause(placeholderMap, dateConditions, false, "os")}
                GROUP BY os
                ORDER BY count DESC, value
                LIMIT 50
              ) AS t
            )
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
        ) as data;
      `;

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

      // console.log({dateRange});

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


      /*

      ,


          chart', (
            SELECT json_agg(
              json_build_object(
                'date',       buckets_with_dates.date,
                'qr_count',   COALESCE(bucketed_clicks.qr_count, 0),
                'link_count', COALESCE(bucketed_clicks.link_count, 0)
              )
              ORDER BY buckets_with_dates.date DESC
            )
            FROM array_of_buckets
            CROSS JOIN UNNEST(buckets) WITH ORDINALITY AS buckets_with_dates(date, bucket_number)
            LEFT JOIN bucketed_clicks ON buckets_with_dates.bucket_number = bucketed_clicks.bucket_number
          )

      */

      /*

      'chart', (
        SELECT
          buckets_with_dates.date,
          COALESCE(qr_count, 0) AS qr_count,
          COALESCE(link_count, 0) AS link_count
        FROM array_of_buckets
        CROSS JOIN UNNEST(buckets) WITH ORDINALITY AS buckets_with_dates(date, bucket_number)
        LEFT JOIN bucketed_clicks ON buckets_with_dates.bucket_number = bucketed_clicks.bucket_number
        ORDER BY date DESC;
      )


      */

      // console.log(newQuery)
      // console.log(queryParams)

      // console.log(newQuery)
      const response: QueryResponse = await sql(newQuery, [...queryParams]);
      // console.log("empty")
      // console.log(response[0]?.data?.empty);
      // console.log(response[0]?.data?.combobox);
      const validatedResponse = ClickEventSchemas.AnalyticsJSON.parse(response);
      return ServerResponse.success(validatedResponse);

      /*

      {
        source: [ { value: 'link', label: 'source:link', count: 2, percent: 100 } ],
        continent: [ { value: null, label: null, count: 2, percent: 100 } ],
        country: [ { value: null, label: null, count: 2, percent: 100 } ],
        ...
      }
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

      // let chartQuery = "";
      // if (dateRange[0] === undefined) {
      //   chartQuery = `
      //   WITH user_links AS (
      //     SELECT id, original_url, short_url
      //     FROM links
      //     WHERE user_id = $1
      //   ),
      //   filtered_clicks AS (
      //     SELECT ce.*, ul.short_url, ul.original_url
      //     FROM click_events AS ce
      //     JOIN user_links AS ul ON ul.id = ce.link_id
      //     ${whereClause}
      //   ),
      //   date_range AS (
      //     SELECT
      //       (MAX(created_at)::date - MIN(created_at)::date) AS num_days,
      //       MIN(created_at) AS start_date,
      //       MAX(created_at) AS end_date
      //     FROM filtered_clicks
      //   ),
      //   interval AS (
      //     SELECT
      //       CASE
      //         WHEN num_days <= 2 THEN INTERVAL '1 hour'
      //         WHEN num_days <= 4  THEN INTERVAL '6 hours'
      //         WHEN num_days <= 30  THEN INTERVAL '1 day'
      //         WHEN num_days <= 90  THEN INTERVAL '3 days'
      //         WHEN num_days <= 180  THEN INTERVAL '1 week'
      //         WHEN num_days <= 1460  THEN INTERVAL '1 month'
      //         ELSE INTERVAL '1 year'
      //       END AS interval
      //     FROM date_range
      //   ),
      //   time_events AS (
      //     SELECT *
      //     FROM date_range
      //     CROSS JOIN interval
      //   ),
      //   array_of_buckets AS (
      //     SELECT ARRAY_AGG(series) AS buckets
      //       FROM generate_series(
      //       (SELECT start_date FROM time_events)::date,
      //       (SELECT end_date FROM time_events)::date,
      //       (SELECT interval FROM time_events)
      //     ) AS series
      //   ),
      //   bucketed_clicks AS (
      //     SELECT
      //       WIDTH_BUCKET(created_at, array_of_buckets.buckets) AS bucket_number,
      //       SUM(CASE WHEN fc.source = 'qr' THEN 1 ELSE 0 END) AS qr_count,
      //       SUM(CASE WHEN fc.source = 'link' THEN 1 ELSE 0 END) AS link_count
      //     FROM filtered_clicks AS fc
      //     CROSS JOIN array_of_buckets
      //     GROUP BY bucket_number
      //   )

      //   SELECT buckets_with_dates.date, COALESCE(qr_count, 0) AS qr_count, COALESCE(link_count, 0) AS link_count
      //   FROM array_of_buckets
      //   CROSS JOIN UNNEST(buckets) WITH ORDINALITY AS buckets_with_dates(date, bucket_number)
      //   LEFT JOIN bucketed_clicks ON buckets_with_dates.bucket_number = bucketed_clicks.bucket_number
      //   ORDER BY date DESC;
      // `;
      // } else {
      //   chartQuery = `
      //     WITH user_links AS (
      //       SELECT id, original_url, short_url
      //       FROM links
      //       WHERE user_id = $1
      //     ),
      //     filtered_clicks AS (
      //       SELECT ce.*, ul.short_url, ul.original_url
      //       FROM click_events AS ce
      //       JOIN user_links AS ul ON ul.id = ce.link_id
      //       ${whereClause}
      //     ),
      //     date_range AS (
      //       SELECT
      //         (MAX($${datePlaceholders[1]})::date - MIN($${datePlaceholders[0]})::date) AS num_days,
      //         MIN($${datePlaceholders[0]}) AS start_date,
      //         MAX($${datePlaceholders[1]}) AS end_date
      //       FROM filtered_clicks
      //     ),
      //     interval AS (
      //       SELECT
      //         CASE
      //           WHEN num_days <= 2 THEN INTERVAL '1 hour'
      //           WHEN num_days <= 4  THEN INTERVAL '6 hours'
      //           WHEN num_days <= 30  THEN INTERVAL '1 day'
      //           WHEN num_days <= 90  THEN INTERVAL '3 days'
      //           WHEN num_days <= 180  THEN INTERVAL '1 week'
      //           WHEN num_days <= 1460  THEN INTERVAL '1 month'
      //           ELSE INTERVAL '1 year'
      //         END AS interval
      //       FROM date_range
      //     ),
      //     time_events AS (
      //       SELECT *
      //       FROM date_range
      //       CROSS JOIN interval
      //     ),
      //     array_of_buckets AS (
      //       SELECT ARRAY_AGG(series) AS buckets
      //         FROM generate_series(
      //         (SELECT start_date FROM time_events)::date,
      //         (SELECT end_date FROM time_events)::date,
      //         (SELECT interval FROM time_events)
      //       ) AS series
      //     ),
      //     bucketed_clicks AS (
      //       SELECT
      //         WIDTH_BUCKET(created_at, array_of_buckets.buckets) AS bucket_number,
      //         SUM(CASE WHEN fc.source = 'qr' THEN 1 ELSE 0 END) AS qr_count,
      //         SUM(CASE WHEN fc.source = 'link' THEN 1 ELSE 0 END) AS link_count
      //       FROM filtered_clicks AS fc
      //       CROSS JOIN array_of_buckets
      //       GROUP BY bucket_number
      //     )

      //     SELECT buckets_with_dates.date, COALESCE(qr_count, 0) AS qr_count, COALESCE(link_count, 0) AS link_count
      //     FROM array_of_buckets
      //     CROSS JOIN UNNEST(buckets) WITH ORDINALITY AS buckets_with_dates(date, bucket_number)
      //     LEFT JOIN bucketed_clicks ON buckets_with_dates.bucket_number = bucketed_clicks.bucket_number
      //     ORDER BY date DESC;
      //   `;
      // }

      // const jsonResponse: QueryResponse = await sql(jsonQuery, [...queryParams, LIMIT]);
      // const jsonResult = parseJSONQueryResponse(jsonResponse, ClickEventSchemas.JSONAgg);

      // const chartResponse: QueryResponse = await sql(chartQuery, queryParams);
      // const chartResult = parseQueryResponse(chartResponse, ClickEventSchemas.Chart);

      // return ServerResponse.success({
      //   chart: chartResult,
      //   json: jsonResult
      // });

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
      if (dateRange[0]) {
        queryParams.push(dateRange[0].toISOString());
        conditions.push(`ce.created_at >= $${placeholderIndex}`);
        datePlaceholders[0] = placeholderIndex++;
      }

      if (dateRange[1]) {
        queryParams.push(dateRange[1].toISOString());
        conditions.push(`ce.created_at <= $${placeholderIndex}`);
        datePlaceholders[1] = placeholderIndex++;
      }

      if (queryString && queryField) {
        conditions.push(`${queryField} ILIKE '%' || $${placeholderIndex++} || '%'`);
        queryParams.push(queryString);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      const testquery = `
        WITH filtered_clicks AS (
          SELECT
            user_links.id AS id,
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
              SELECT ul.original_url::TEXT AS value, 'source:' || ul.original_url::TEXT AS label, COUNT(filtered_clicks.id) AS count, (COUNT(filtered_clicks.id) * 100.0 / (SELECT total FROM total_count)) AS percent
              FROM filtered_clicks
              RIGHT JOIN (
                SELECT *
                FROM links
                WHERE user_id = $1
              ) AS ul ON ul.id = filtered_clicks.id
              GROUP BY (ul.id, ul.original_url)
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
