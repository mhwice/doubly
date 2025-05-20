import { z } from "zod";

export const FilterEnum = z.enum([
  "source",
  "continent",
  "country",
  "city",
  "originalUrl",
  "shortUrl",
  "browser",
  "device",
  "os",
  "region",
]);

export const Pair = z.tuple([
  z.string().trim().min(1).max(15), // key length
  z.string().trim().min(1).max(63), // value length
]);

type Pair = z.infer<typeof Pair>;

/** Ensures array of unique k/v pairs */
export const uniquePairsSchema = z.array(Pair).max(50)
.refine(
  (arr) => new Set(arr.map((x) => JSON.stringify(x))).size === arr.length,
  { message: "Duplicate key/value pairs are not allowed" }
)

export const dateCheck: [
  (obj: { dateRange: [Date | undefined, Date | undefined] }) => boolean,
  { message: string; path: ["dateRange"] }
] = [
  (obj) => {
    const [start, end] = obj.dateRange;
    return !(start && end) || start.getTime() <= end.getTime();
  },
  {
    message:
      "If both dateStart and dateEnd are provided, dateStart must be before or equal to dateEnd",
    path: ["dateRange"],
  },
];

export const queryCheck: [
  (obj: { queryString?: unknown; queryField?: unknown }) => boolean,
  { message: string; path: ["queryString", "queryField"] }
] = [
  (obj) =>
    (obj.queryString != null && obj.queryField != null) ||
    (obj.queryString == null && obj.queryField == null),
  {
    message:
      "Both 'queryString' and 'queryField' must be provided together or omitted together",
    path: ["queryString", "queryField"],
  },
];

/**
 * Ensures that the array of Pairs must have keys which are FilterEnums or
 * one of the keys provided in singletonKeys. A singleton key must only appear at most once.
*/
export function singletonAndEnumRefine<SK extends string>(singletonKeys: readonly SK[]) {
  return (arr: Pair[], ctx: z.RefinementCtx) => {

    // Count every key occurence
    const counts = arr.reduce<Record<string, number>>((acc, [k]) => {
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    // Make sure singleton keys exist at most once
    for (const key of singletonKeys) {
      if ((counts[key] || 0) > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `At most one '${key}' pair is allowed`,
        });
      }
    }

    // Make sure non-singleton keys are FilterEnums
    for (const [key] of arr) {
      if (!singletonKeys.includes(key as SK)) {
        if (!FilterEnum.safeParse(key).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid filter key '${key}'`,
          });
        }
      }
    }
  };
}
