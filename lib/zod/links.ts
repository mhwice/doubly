import { z } from 'zod';

const LinkTableSchema = z.object({
  id: z.number().nonnegative().lt(2_147_483_648),
  originalUrl: z.string().trim().min(1).max(255).url(),
  shortUrl: z.string().trim().min(1).max(63).url(),
  code: z.string().trim().min(1).max(15),
  linkClicks: z.number().nonnegative().lt(2_147_483_648),
  qrClicks: z.number().nonnegative().lt(2_147_483_648),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().trim().min(1),
  expiresAt: z.date().optional(),
  password: z.string().trim().min(1).max(63).optional()
});

const LinkCreateUrlSchema = z.object({
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
});

const LinkDeleteSchema = LinkTableSchema.pick({
  id: true,
  userId: true
});

const LinkDeleteUrlSchema = LinkTableSchema.pick({
  id: true,
});

const LinkDTOSchema = LinkTableSchema.pick({
  id: true,
  originalUrl: true,
  shortUrl: true,
  linkClicks: true,
  qrClicks: true,
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

const FilterEnum = z.enum(["source", "continent", "country", "city", "originalUrl", "shortUrl"]);
export type FilterEnumType = z.infer<typeof FilterEnum>;

const LinkGetAllSchema = LinkTableSchema.pick({
  userId: true
}).extend({
  options: z.map(
    FilterEnum,
    z.string().trim().min(1).array()
  ),
  dateRange: z.tuple([
    z.date(),
    z.date()
  ]).optional()
});

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
    z.date(),
    z.date()
  ]).refine(([start, end]) => {
    return start <= end;
  }, { message: "range start date must be before range end data" }).optional()
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
  id: true
}).extend({
  updates: LinkTableSchema.pick({ originalUrl: true })
});

const LinkEditUrlSchema = LinkTableSchema.pick({
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
  export const CreateUrl = LinkCreateUrlSchema;
  export const Edit = LinkEditSchema;
  export const EditUrl = LinkEditUrlSchema;
  export const Delete = LinkDeleteSchema;
  export const DeleteUrl = LinkDeleteUrlSchema;
  export const DTO = LinkDTOSchema;
  export const GetAll = LinkGetAllSchema;
  export const Lookup = LinkLookupSchema;
  export const ClickEvent = LinkClickEventSchema;
}

export namespace LinkTypes {
  export type Link = z.infer<typeof LinkTableSchema>;
  export type Create = z.infer<typeof LinkCreateSchema>;
  export type CreateUrl = z.infer<typeof LinkCreateUrlSchema>;
  export type Edit = z.infer<typeof LinkEditSchema>;
  export type EditUrl = z.infer<typeof LinkEditUrlSchema>;
  export type Delete = z.infer<typeof LinkDeleteSchema>;
  export type DeleteUrl = z.infer<typeof LinkDeleteUrlSchema>;
  export type DTO = z.infer<typeof LinkDTOSchema>;
  export type Id = Delete["id"];
  export type Lookup = z.infer<typeof LinkLookupSchema>;
  export type GetAll = z.infer<typeof LinkGetAllSchema>;
  export type ClickEvent = z.infer<typeof LinkClickEventSchema>;
}
