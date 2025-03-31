import { camelCase, snakeCase } from "change-case";
import { z } from "zod";

export type SQLRecord = {
  [key: string]: unknown
}

export type QueryResponse = SQLRecord[];

type FormattedSQLRecord = {
  [k: string]: unknown;
}

/**
 * An asynchronous function which waits the specified amount of time.
 * Useful for simulating slow network requests.
 *
 * @param delay Time to wait in milliseconds
 * @return A promise that resolves after the specified delay. The resolved value is not meaningful.
 */
export async function sleep(delay: number) {
  return await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Parses a single row from a node-pg query response.
 * This includes converting column names to camelCase format, replacing 'null' with 'undefined', converting
 * stringified numbers to numbers (ie. "123" → 123) and optionally converting column values to camelCase.
 *
 * @param record A single row from a node-pg query response
 * @param columnsToFormat - An optional array of column names for which the corresponding values will be converted to camelCase
 * @returns A fomatted (but un-typed) row
 */
export function formatDBResponse(record: SQLRecord, columnsToFormat?: string[]): FormattedSQLRecord {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => {

      if (columnsToFormat?.includes(key)) {
        const convertedValue = safeConvert(value);
        if (typeof convertedValue === "string") return [camelCase(key), camelCase(convertedValue)];
        return [camelCase(key), value === null ? undefined : convertedValue];
      }

      // if (Array.isArray(value)) {
      //   return [camelCase(key), value.map((entry) => entry === null ? undefined : entry)];
      // }

      return [camelCase(key), value === null ? undefined : safeConvert(value)];
    })
  );
}

/**
 * Formats and validates a node-pg query response against a Zod schema.
 * Throws an error if unsuccessful.
 *
 * @param response The raw response object from a node-pg query
 * @param zodSchema A Zod schema to validate a single row of the query response
 * @param columnsToFormat An optional array of column names for which the corresponding values will be converted to camelCase
 * @returns A validated array of data
 */
export function parseQueryResponse<T>(response: QueryResponse, zodSchema: z.ZodSchema<T>, columnsToFormat?: string[]) {
  return response.map((row) => zodSchema.parse(formatDBResponse(row, columnsToFormat)));
}

/**
 * Converts a value to a number in the range [2^53-1,2^53-1] if possible, otherwise returns the original value.
 *
 * @param value The value to convert
 * @returns Either the converted value or the original value
 */
export function safeConvert(value: unknown): unknown {
  try {
    if (typeof value !== "string") return value;

    const trimmed = value.trim();
    if (trimmed === "") return value;

    // A regular expression to roughly match numeric literals:
    const numericRegex = /^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/;
    if (!numericRegex.test(trimmed)) return value;

    const num = Number(trimmed);
    if (isNaN(num)) return value;
    if (num < Number.MIN_SAFE_INTEGER || num > Number.MAX_SAFE_INTEGER) return value;
    return num;
  } catch (error: unknown) {
    return value;
  }
}
