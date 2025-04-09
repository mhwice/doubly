import { snakeCase } from 'change-case';
import { z } from 'zod';

const LinkTableSchema = z.object({
  id: z.number().nonnegative().lt(2_147_483_648),
  originalUrl: z.string().trim().min(1).max(255).url(),
  shortUrl: z.string().trim().min(1).max(63).url(),
  code: z.string().trim().min(1).max(15),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().trim().min(1),
  expiresAt: z.date().optional(),
  password: z.string().trim().min(1).max(63).optional()
});

const LinkDashboardSchema = LinkTableSchema.pick({
  id: true,
  originalUrl: true,
  shortUrl: true,
  updatedAt: true,
}).extend({
  linkClicks: z.number().nonnegative(),
  qrClicks: z.number().nonnegative()
})

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
  password: true
}).transform((data) => {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined).map(([key, value]) => [snakeCase(key), value])
  );
});

const LinkDeleteSchema = LinkTableSchema.pick({
  id: true,
  userId: true
});

const LinkDeleteLinkSchema = LinkTableSchema.pick({
  id: true,
});

const LinkDTOSchema = LinkTableSchema.pick({
  id: true,
  originalUrl: true,
  shortUrl: true,
})

const LinkLookupSchema = LinkTableSchema.pick({
  code: true
}).extend({
  source: z.enum(["qr", "link"])
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

const FilterEnum = z.enum(["source", "continent", "country", "city", "originalUrl", "shortUrl", "browser", "device", "os", "region"]);
export type FilterEnumType = z.infer<typeof FilterEnum>;

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

export const APIContents = z.object({
  selectedValues: z.tuple([
    FilterEnum,
    z.string().trim().min(1)
  ]).array().refine((val) => {
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
  }, { message: "a filter pair must be unique" }),
  dateRange: z.tuple([
    z.date().optional(),
    z.date()
  ]).refine(([start, end]) => {
    if (start !== undefined) return start <= end;
    return true;
  }, { message: "range start date must be before range end data" }),
  queryString: z.string().min(1).optional(),
  queryField: FilterEnum.optional()
}).refine((data) => (data.queryString === undefined && data.queryField === undefined) ||
  (data.queryString !== undefined && data.queryField !== undefined),
  // the refine() method has the purpose of
  // ensuring that the queryString and the field value
  // must either both be defined, or both be undefined

  {
    message: "Both queryString and field must be either provided or omitted",
    path: ["queryString", "queryField"]
  }
);

type API = z.infer<typeof APIContents>;

export const CityLookup = z.object({
  query: z.string()
})

export const CityDALLookup = z.object({
  query: z.string(),
  userId: z.string()
})

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
  id: true
}).extend({
  updates: LinkTableSchema.pick({ originalUrl: true })
});

const LinkEditLinkSchema = LinkTableSchema.pick({
  id: true
}).extend({
  updates: LinkTableSchema.pick({ originalUrl: true })
});

const LinkClickEventSchema = LinkTableSchema.pick({
  id: true,
  userId: true
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
