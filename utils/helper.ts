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
    Object.entries(record).map(([key, value]) => [camelCase(key), value === null ? undefined : value])
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
