import { z } from 'zod';
import { LinkSchemas } from './links';
import { snakeCase } from 'change-case';

// TODO - check what happens if I insert a lat/lng into the db with too much precision
//        such as 1.2345678901234567890123456789012345678901234567890
const ClickEventSchema = z.object({
  id: z.number().nonnegative().lt(2_147_483_648),
  linkId: z.number().nonnegative().lt(2_147_483_648),
  source: z.enum(["qr", "link"]),
  createdAt: z.date(),
  country: z.string().trim().length(2).optional(),
  continent: z.string().trim().length(2).optional(),
  region: z.string().trim().min(1).max(3).optional(),
  city: z.string().trim().min(1).optional(),
  latitude: z.number().gte(-90).lte(90).optional(),
  longitude: z.number().gte(-180).lte(180).optional(),
});

// const ClickEventCreateSchema = ClickEventSchema.omit({
//   id: true
// });

const ClickEventCreateSchema = ClickEventSchema.omit({
  id: true
}).transform((data) => {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined).map(([key, value]) => [snakeCase(key), value])
  );
});

// type snack = z.infer<typeof ClickEventCreateSchemaWithTransform>;

// const ClickEventGetAllSchema = ClickEventSchema.pick({
//   linkId: true
// });

const ClickFilterSchema = z.object({
  field: z.string(), //z.enum(["source", "continent", "country", "city", "originalUrl", "shortUrl"]),
  value: z.string().optional(),//.trim().min(1).max(255).optional(),
  count: z.number()//z.preprocess(Number, z.number())
})

const ClickChartSchema = z.object({
  date: z.date(),
  qrCount: z.number(),
  linkCount: z.number()
})

// const FilterRepsonseSchema = z.object({
//   filter: ClickFilterSchema.array(),
//   chart: ClickChartSchema.array(),
// });

const JSONEntitySchema = z.object({
  value: z.string(),
  count: z.number()
}).array();

const ClickJsonGetAllSchema = z.object({
  source: JSONEntitySchema,
  country: JSONEntitySchema,
  region: JSONEntitySchema,
  continent: JSONEntitySchema,
  city: JSONEntitySchema,
  shortUrl: JSONEntitySchema,
  originalUrl: JSONEntitySchema,
  browser: JSONEntitySchema,
  device: JSONEntitySchema,
  os: JSONEntitySchema
});

const FilterRepsonseSchema = z.object({
  filter: ClickFilterSchema.array(),
  chart: ClickChartSchema.array(),
  json: ClickJsonGetAllSchema,
});

const ServerResponseFilterSchema = serverResponseSchema(FilterRepsonseSchema);

const FakeClickEventSchema = z.object({
  id: z.number().nonnegative().lt(2_147_483_648),
  linkId: z.number().nonnegative().lt(2_147_483_648),
  source: z.enum(["qr", "link"]),
  createdAt: z.string(),
  country: z.string(),
  countryCode: z.string(),
  shortUrl: z.string(),
  originalUrl: z.string(),
  continent: z.string(),
  region: z.string(),
  city: z.string(),
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180)
});

export namespace ClickEventSchemas {
  export const Click = ClickEventSchema; // used
  export const Create = ClickEventCreateSchema; // used
  // export const GetAll = ClickEventGetAllSchema;
  export const Fake = FakeClickEventSchema; // used
  export const Filter = ClickFilterSchema; // used
  export const Chart = ClickChartSchema; // used
  export const ClickResponse = FilterRepsonseSchema;
  export const ServerResponseFilter = ServerResponseFilterSchema; // used
  export const JSONAgg = ClickJsonGetAllSchema; // used
}

export namespace ClickEventTypes {
  export type Click = z.infer<typeof ClickEventSchema>; // used
  export type Create = z.infer<typeof ClickEventCreateSchema>; // used
  // export type GetAll = z.infer<typeof ClickEventGetAllSchema>;
  export type Fake = z.infer<typeof FakeClickEventSchema>; // used
  export type Filter = z.infer<typeof ClickFilterSchema>; // used
  export type Chart = z.infer<typeof ClickChartSchema>; // used
  export type ClickResponse = z.infer<typeof FilterRepsonseSchema>; // used
  export type ServerResponseFilter = z.infer<typeof ServerResponseFilterSchema>;
  export type JSONAgg = z.infer<typeof ClickJsonGetAllSchema>;
}

/**
 * Given a Zod schema, this function returns a new schema which mirrors a ServerResponse that contains the
 * provided schema. This is very useful for validating the data returned from an API or Server Action.
 *
 * @param dataSchema
 * @returns
 */
function serverResponseSchema<T>(dataSchema: z.ZodType<T>) {
  return z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      data: dataSchema,
    }),
    z.object({
      success: z.literal(false),
      error: z.string(),
    }),
  ]);
}
