import { snakeCase } from "change-case";
import { z } from "zod";
import { serverResponseSchema } from "./server-response-schema";
import { LinkSchema } from "../schemas/link/link.entity";
import {
  dateCheck,
  queryCheck,
  FilterEnum,
  Pair,
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

export const LinkCreateLinkSchema = LinkSchema.pick({
  originalUrl: true
})
.transform(({ originalUrl }) => {
  if (originalUrl.startsWith("https://")) return { originalUrl };
  return { originalUrl: "https://" + originalUrl };
})
.refine(({ originalUrl }) => {
  try {
    const url = new URL(originalUrl);
    return url.protocol === "https:";
  } catch {
    return false;
  }
});

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

export const APILinkGetAllSchema = LinkSchema.pick({
  userId: true,
})
  .extend({
    dateEnd: z.date()
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

export const APIContents = z
  .object({
    selectedValues: z
      .tuple([FilterEnum, z.string().trim().min(1)])
      .array()
      .refine(
        (val) => {
          const map: Map<FilterEnumType, Set<string>> = new Map();
          for (const [k, v] of val) {
            if (map.has(k)) {
              if (map.get(k)?.has(v)) return false;
              map.get(k)?.add(v);
            } else {
              map.set(k, new Set([v]));
            }
          }
          return true;
        },
        { message: "a filter pair must be unique" }
      ),
    dateRange: z.tuple([z.date().optional(), z.date()]).refine(
      ([start, end]) => {
        if (start !== undefined) return start <= end;
        return true;
      },
      { message: "range start date must be before range end data" }
    ),
    queryString: z.string().min(1).optional(),
    queryField: FilterEnum.optional(),
  })
  .refine(...queryCheck)

export const LinkAllSchema = z.array(Pair).length(1).refine((arr) => arr[0][0] === "dateEnd")
  .transform((arr) => {
    return { dateEnd: new Date(arr[0][1]) }
  })

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

export const NewAPIContents = z
  .object({
    selectedValues: z
      .tuple([FilterEnum, z.string().trim().min(1)])
      .array()
      .refine(
        (val) => {
          const map: Map<FilterEnumType, Set<string>> = new Map();
          for (const [k, v] of val) {
            if (map.has(k)) {
              if (map.get(k)?.has(v)) return false;
              map.get(k)?.add(v);
            } else {
              map.set(k, new Set([v]));
            }
          }
          return true;
        },
        { message: "a filter pair must be unique" }
      ),
    dateRange: z.tuple([z.coerce.date().optional(), z.coerce.date()]).refine(
      ([start, end]) => {
        if (start !== undefined) return start <= end;
        return true;
      },
      { message: "range start date must be before range end data" }
    ),
    queryString: z.string().min(1).optional(),
    queryField: FilterEnum.optional(),
  })
  .refine(...queryCheck)

export const ServerResponseLinksGetAllSchema = serverResponseSchema(LinkDashboardSchema.array());

export type Create = z.infer<typeof LinkCreateSchema>;
export type CreateLink = z.infer<typeof LinkCreateLinkSchema>;
export type Dashboard = z.infer<typeof LinkDashboardSchema>;
export type GetAll = z.infer<typeof LinkGetAllSchema>;
export type FilterEnumType = z.infer<typeof FilterEnum>;
