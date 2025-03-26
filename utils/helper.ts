import { camelCase, snakeCase } from "change-case";
import { z } from "zod";

// var types = require('pg').types
// import types from "pg-types";

export type SQLRecord = {
  [key: string]: unknown
}

export type QueryResponse = SQLRecord[];

export async function sleep(delay: number) {
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export function formatDBResponse(record: SQLRecord) {
  const res = Object.fromEntries(
    Object.entries(record).map(([key, value]) => {

      // console.log(key, value)

      if (Array.isArray(value)) {
        return [camelCase(key), value.map((entry) => entry === null ? undefined : entry)];
      }

      /*
      Hack! node-pg returns enums as a string instead of an array.
      so our source enum returns as {'qr','link'} instead of ['qr', 'link']
      this fixes that
      */
      if (typeof value === "string" && value.length >= 2 && value.at(0) === "{" && value.at(-1) === "}") {
        return [camelCase(key), value.slice(1, -1).split(",")];
      }

      return [camelCase(key), value === null ? undefined : value];
    })
  );

  // console.log(res)
  return res;
}

export function formatDBFilterResponse(record: SQLRecord) {
  const res = Object.fromEntries(
    Object.entries(record).map(([key, value]) => {
      if (key === "field" && typeof value === "string") return [key, camelCase(value)];
      if (key === "count" && typeof value === "string") return [key, parseInt(value)];
      return [key, value === null ? undefined : value];
    })
  );

  // console.log(res)
  return res;
}

export function formatDBChartResponse(record: SQLRecord) {
  const res = Object.fromEntries(
    Object.entries(record).map(([key, value]) => {
      if ((key === "qr_count" || key === "link_count") && typeof value === "string") return [camelCase(key), parseInt(value)];
      return [key, value === null ? undefined : value];
    })
  );

  // console.log(res)
  return res;
}

export function mapFieldsToInsert(record: SQLRecord): SQLRecord {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [snakeCase(key), value])
  );
}

export function parseChartQueryResponse<T>(response: QueryResponse, zodSchema: z.ZodSchema<T>) {
  return response.map((row) => {
    const formatted = formatDBChartResponse(row);
    // console.log("wow", formatted)
    return zodSchema.parse(formatted);
  });
}

export function parseFilterQueryResponse<T>(response: QueryResponse, zodSchema: z.ZodSchema<T>) {
  return response.map((row) => {
    const formatted = formatDBFilterResponse(row);
    // console.log("wow", formatted)
    return zodSchema.parse(formatted);
  });
}

export function parseQueryResponse<T>(response: QueryResponse, zodSchema: z.ZodSchema<T>) {
  return response.map((row) => zodSchema.parse(formatDBResponse(row)));
}
