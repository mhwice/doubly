import { camelCase, snakeCase } from "change-case";
import { z } from "zod";

export type SQLRecord = {
  [key: string]: unknown
}

export type QueryResponse = SQLRecord[];

export async function sleep(delay: number) {
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export function formatDBResponse(record: SQLRecord) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => {

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
}

export function mapFieldsToInsert(record: SQLRecord): SQLRecord {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [snakeCase(key), value])
  );
}

export function parseQueryResponse<T>(response: QueryResponse, zodSchema: z.ZodSchema<T>) {
  return response.map((row) => zodSchema.parse(formatDBResponse(row)));
}
