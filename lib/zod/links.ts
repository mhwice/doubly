import { snakeCase } from "change-case";
import { z } from "zod";
import { serverResponseSchema } from "./server-response-schema";
import { LinkSchema } from "../schemas/link/link.entity";
import {
  dateCheck,
  queryCheck,
  FilterEnum,
  singletonAndEnumRefine,
  uniquePairsSchema
} from "./link-helpers";

export const LinkDashboardSchema = LinkSchema.pick({
  id: true,
  originalUrl: true,
  shortUrl: true,
  updatedAt: true,
}).extend({
  linkClicks: z.number().nonnegative(),
  qrClicks: z.number().nonnegative(),
});

// I want to replace this, but its better to wait for Zod v4 which has better url handling
export const OriginalUrlSchema = z
  .object({ originalUrl: z.string().trim().min(1, { message: "link is required" }).max(255) })
  .transform(({ originalUrl }) => ({
    originalUrl: originalUrl.startsWith("https://")
      ? originalUrl
      : "https://" + originalUrl,
  }))
  .refine(
    ({ originalUrl }) => {
      try {
        const url = new URL(originalUrl);
        // also enforce at least one dot in the hostname
        return url.protocol === "https:" && url.hostname.includes(".");
      } catch {
        return false;
      }
    },
    {
      message: "must be a valid URL (including a dot in the domain)",
      path: ["originalUrl"],      // ← now the error lives on the field
    }
  );


export const LinkCreateSchema = LinkSchema.pick({
  originalUrl: true,
  shortUrl: true,
  code: true,
  userId: true,
}).transform((data) => {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [snakeCase(key), value])
    );
});

export const LinkGetAllSchema = LinkSchema.pick({
    userId: true
  }).extend({
    options: z.map(
      FilterEnum,
      z.string().trim().min(1).array()
    ),
    dateRange: z.tuple([
      z.date().optional(),
      z.date().optional()
    ]),
    queryString: z.string().min(1).optional(),
    queryField: FilterEnum.optional()
  })
  .refine(...queryCheck)

export const QueryGetAllSchema = LinkSchema.pick({
    userId: true
  }).extend({
    options: z.map(
      FilterEnum,
      z.string().trim().min(1).array()
    ),
    dateRange: z.tuple([
      z.date().optional(),
      z.date().optional()
    ]),
    queryString: z.string().min(1),
    queryField: FilterEnum
  });

export const FilterAPIParamsSchema = uniquePairsSchema
.superRefine(singletonAndEnumRefine(["dateStart", "dateEnd"] as const))
  .transform((arr) => {

    const result = {
      options: new Map<FilterEnumType, string[]>(),
      dateRange: [undefined, undefined] as [Date | undefined, Date | undefined],
    };

    for (const [key, value] of arr) {
      switch (key) {
        case "dateStart":
          result.dateRange[0] = new Date(value); // never throws!
          break;
        case "dateEnd":
          result.dateRange[1] = new Date(value);
          break;
        default:
          {
            const k = key as FilterEnumType;
            const bucket = result.options.get(k) ?? [];
            bucket.push(value);
            result.options.set(k, bucket);
          }
      }
    }

    return result;
  })
  // If both dates provided, start <= end
  .refine(...dateCheck)

export const QuerySchema = uniquePairsSchema
  .superRefine(singletonAndEnumRefine(["dateStart", "dateEnd", "queryString", "queryField"] as const))
  .transform((arr) => {

    const result = {
      options: new Map<FilterEnumType, string[]>(),
      queryString: undefined as string | undefined,
      queryField: undefined as FilterEnumType | undefined,
      dateRange: [undefined, undefined] as [Date | undefined, Date | undefined],
    };

    for (const [key, value] of arr) {
      switch (key) {
        case "queryString":
          result.queryString = value;
          break;
        case "queryField":
          result.queryField = value as FilterEnumType;
          break;
        case "dateStart":
          result.dateRange[0] = new Date(value);
          break;
        case "dateEnd":
          result.dateRange[1] = new Date(value);
          break;
        default:
          {
            const k = key as FilterEnumType;
            const bucket = result.options.get(k) ?? [];
            bucket.push(value);
            result.options.set(k, bucket);
          }
      }
    }

    return result;
  })
  .refine(...queryCheck)
  .refine(...dateCheck)

export const ServerResponseLinksGetAllSchema = serverResponseSchema(LinkDashboardSchema.array());

export type Dashboard = z.infer<typeof LinkDashboardSchema>;
export type GetAll = z.infer<typeof LinkGetAllSchema>;
export type FilterEnumType = z.infer<typeof FilterEnum>;
