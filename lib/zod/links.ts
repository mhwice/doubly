import { snakeCase } from "change-case";
import { z } from "zod";
import { serverResponseSchema } from "./clicks";

const LinkTableSchema = z.object({
  id: z.number().nonnegative().lt(2_147_483_648),
  originalUrl: z.string().trim().min(1).max(255).url(),
  shortUrl: z.string().trim().min(1).max(63).url(),
  code: z.string().trim().min(1).max(15),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().trim().min(1),
  expiresAt: z.date().optional(),
  password: z.string().trim().min(1).max(63).optional(),
});

const LinkDashboardSchema = LinkTableSchema.pick({
  id: true,
  originalUrl: true,
  shortUrl: true,
  updatedAt: true,
}).extend({
  linkClicks: z.number().nonnegative(),
  qrClicks: z.number().nonnegative(),
});

const LinkCreateLinkSchema = z.object({
  originalUrl: z.string(),
  password: z.string().optional(),
  expiresAt: z.date().optional(),
});

const LinkCreateSchema = LinkTableSchema.pick({
  originalUrl: true,
  shortUrl: true,
  code: true,
  userId: true,
  expiresAt: true,
  password: true,
}).transform((data) => {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [snakeCase(key), value])
  );
});

const LinkDeleteSchema = LinkTableSchema.pick({
  id: true,
  userId: true,
});

const LinkDeleteLinkSchema = LinkTableSchema.pick({
  id: true,
});

const LinkDTOSchema = LinkTableSchema.pick({
  id: true,
  originalUrl: true,
  shortUrl: true,
});

const LinkLookupSchema = LinkTableSchema.pick({
  code: true,
}).extend({
  source: z.enum(["qr", "link"]),
});

// I want to have a tighter bound on the key here.
// It must be one of ["source", "continent", "country", "city", "originalUrl", "shortUrl"]
// can I make it into:

/*

const ex = [
  { key: "source", values: ["qr"] },
  { key: "country", values: ["CA", "RO"] },
];

array of objects, where key is an enum, and values are an array of strings?
*/

// const LinkGetAllSchema = LinkTableSchema.pick({
//   userId: true
// }).extend({
//   options: z.tuple([
//     z.string().trim().min(1), // key
//     z.string().trim().min(1)  // value
//   ]).array().optional()
// });


const FilterEnum = z.enum([
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

export type FilterEnumType = z.infer<typeof FilterEnum>;

export const APILinkGetAllSchema = LinkTableSchema.pick({
  userId: true,
})
  .extend({
    dateEnd: z.date()
  });

  const LinkGetAllSchema = LinkTableSchema.pick({
    userId: true
  }).extend({
    options: z.map(
      FilterEnum,
      z.string().trim().min(1).array()
    ),
    dateRange: z.tuple([
      // I am making this tuple of type [date|undefined, date]
      // so that we can just pass a second value [undefined, Date.now()]
      // which means, get everything up to now
      // which is what we want whenever the date range is not manually set
      z.date().optional(),
      z.date()
    ]),
    queryString: z.string().min(1).optional(),
    queryField: FilterEnum.optional()
  }).refine((data) =>
    // the refine() method has the purpose of
    // ensuring that the queryString and the field value
    // must either both be defined, or both be undefined
      (data.queryString === undefined && data.queryField === undefined) ||
      (data.queryString !== undefined && data.queryField !== undefined),
    {
      message: "Both queryString and field must be either provided or omitted",
      path: ["queryString", "queryField"]
    }
  );

export const ServerResponseLinksGetAllSchema = serverResponseSchema(LinkDashboardSchema.array());

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
  .refine(
    (data) =>
      (data.queryString === undefined && data.queryField === undefined) ||
      (data.queryString !== undefined && data.queryField !== undefined),
    // the refine() method has the purpose of
    // ensuring that the queryString and the field value
    // must either both be defined, or both be undefined

    {
      message: "Both queryString and field must be either provided or omitted",
      path: ["queryString", "queryField"],
    }
  );

// 2. Base pair schema: [key, value]
const Pair = z.tuple([
  z.string().trim().min(1).max(15),
  z.string().trim().min(1).max(63),
]);

export const LinkAllSchema = z.array(Pair).length(1).refine((arr) => arr[0][0] === "dateEnd")
  .transform((arr) => {
    return { dateEnd: new Date(arr[0][1]) }
  })

// 3. Special singleton keys
const singletonKeys = [
  "queryString",
  "queryField",
  "dateStart",
  "dateEnd",
] as const;

type SingletonKey = typeof singletonKeys[number];

// 4. Main schema: array of pairs
export const QueryArraySchema = z
  .array(Pair).max(50)
  // 4a. No duplicate tuples
  .refine(
    (arr) => new Set(arr.map((x) => JSON.stringify(x))).size === arr.length,
    { message: "Duplicate key/value pairs are not allowed" }
  )
  // 4b. Super-refine singleton cardinality + key validity
  .superRefine((arr, ctx) => {
    const counts: Record<string, number> = {};
    for (const [key] of arr) {
      counts[key] = (counts[key] || 0) + 1;
    }

    // Check singleton constraints
    for (const key of singletonKeys) {
      if ((counts[key] || 0) > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [],
          message: `At most one '${key}' pair is allowed`,
        });
      }
    }

    // Validate other keys against FilterEnum
    for (const [key] of arr) {
      if (!singletonKeys.includes(key as SingletonKey)) {
        const ok = FilterEnum.safeParse(key).success;
        if (!ok) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [],
            message: `Invalid filter key '${key}'`,
          });
        }
      }
    }
  })
  // 5. Convert flat tuple array into structured object
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
  // 6. Ensure queryString & queryField are both present or both absent
  .refine(
    (obj) =>
      (obj.queryString != null && obj.queryField != null) ||
      (obj.queryString == null && obj.queryField == null),
    {
      message: "Both 'queryString' and 'queryField' must be provided together or omitted together",
      path: ["queryString", "queryField"],
    }
  )
  // 7. If both dates provided, start <= end
  .refine(
    (obj) => {
      const [start, end] = obj.dateRange;
      return !(start && end) || start.getTime() <= end.getTime();
    },
    {
      message: "If both dateStart and dateEnd are provided, dateStart must be before or equal to dateEnd",
      path: ["dateRange"],
    }
  );


export type QueryArraySchema = z.infer<typeof QueryArraySchema>;

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
  .refine(
    (data) =>
      (data.queryString === undefined && data.queryField === undefined) ||
      (data.queryString !== undefined && data.queryField !== undefined),
    // the refine() method has the purpose of
    // ensuring that the queryString and the field value
    // must either both be defined, or both be undefined

    {
      message: "Both queryString and field must be either provided or omitted",
      path: ["queryString", "queryField"],
    }
  );

type API = z.infer<typeof APIContents>;

export const CityLookup = z.object({
  query: z.string(),
});

export const CityDALLookup = z.object({
  query: z.string(),
  userId: z.string(),
});

// function refineFn(val: [string,string][]) {
//   const map = new Map();
//   for (const [k, v] of val) {
//     if (map.has(k)) {
//       if (map.get(k).has(v)) return false;
//       map.get(k).add(v);
//     } else {
//       map.set(k, [v]);
//     }
//   }

//   return true;
// }

const LinkEditSchema = LinkTableSchema.pick({
  userId: true,
  id: true,
}).extend({
  updates: LinkTableSchema.pick({ originalUrl: true }),
});

const LinkEditLinkSchema = LinkTableSchema.pick({
  id: true,
}).extend({
  updates: LinkTableSchema.pick({ originalUrl: true }),
});

const LinkClickEventSchema = LinkTableSchema.pick({
  id: true,
  userId: true,
});

export namespace LinkSchemas {
  export const Table = LinkTableSchema;
  export const Create = LinkCreateSchema;
  export const CreateLink = LinkCreateLinkSchema;
  export const Edit = LinkEditSchema;
  export const EditLink = LinkEditLinkSchema;
  export const Delete = LinkDeleteSchema;
  export const DeleteLink = LinkDeleteLinkSchema;
  export const DTO = LinkDTOSchema;
  export const GetAll = LinkGetAllSchema;
  export const Lookup = LinkLookupSchema;
  // export const ClickEvent = LinkClickEventSchema;
  export const Dashboard = LinkDashboardSchema;
}

export namespace LinkTypes {
  export type Link = z.infer<typeof LinkTableSchema>;
  export type Create = z.infer<typeof LinkCreateSchema>;
  export type CreateLink = z.infer<typeof LinkCreateLinkSchema>;
  export type Edit = z.infer<typeof LinkEditSchema>;
  export type EditLink = z.infer<typeof LinkEditLinkSchema>;
  export type Delete = z.infer<typeof LinkDeleteSchema>;
  export type DeleteLink = z.infer<typeof LinkDeleteLinkSchema>;
  export type DTO = z.infer<typeof LinkDTOSchema>;
  export type Id = Delete["id"];
  export type Lookup = z.infer<typeof LinkLookupSchema>;
  export type GetAll = z.infer<typeof LinkGetAllSchema>;
  // export type ClickEvent = z.infer<typeof LinkClickEventSchema>;
  export type Dashboard = z.infer<typeof LinkDashboardSchema>;
}
