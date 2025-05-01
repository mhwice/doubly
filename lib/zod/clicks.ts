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
  country: z.string().trim().min(1).max(63).optional(),
  continent: z.string().trim().min(1).max(63).optional(),
  region: z.string().trim().min(1).max(63).optional(),
  city: z.string().trim().min(1).max(63).optional(),
  latitude: z.number().gte(-90).lte(90).optional(),
  longitude: z.number().gte(-180).lte(180).optional(),
  device: z.string().trim().min(1).optional(),
  browser: z.string().trim().min(1).optional(),
  os: z.string().trim().min(1).optional(),
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
  count: z.number(),
  percent: z.number(),
  label: z.string()
});

const ClickJsonGetAllSchema = z.object({
  source: JSONEntitySchema.array(),
  country: JSONEntitySchema.array(),
  region: JSONEntitySchema.array(),
  continent: JSONEntitySchema.array(),
  city: JSONEntitySchema.array(),
  shortUrl: JSONEntitySchema.array(),
  originalUrl: JSONEntitySchema.array(),
  browser: JSONEntitySchema.array(),
  device: JSONEntitySchema.array(),
  os: JSONEntitySchema.array()
});

const FilterRepsonseSchema = z.object({
  // filter: ClickFilterSchema.array(),
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

const ServerResponseQuerySchema = serverResponseSchema(JSONEntitySchema.array());

export const ComboboxJSONEntitySchema = z.object({
  value: z.string(),
  count: z.number(),
  label: z.string()
});

export type ComboboxQuery = z.infer<typeof ComboboxJSONEntitySchema>;

export const ServerResponseComboboxSchema = serverResponseSchema(ComboboxJSONEntitySchema.array());

// I expect an array with 1 element who is a object with a single key called "data".
// data has an object with 4 keys which are tabs, stats, combobox, and chart.

const AnalyticsJSONSchema = z.object({
  data: z.object({
    tabs: z.object({
      source: JSONEntitySchema.array(),
      country: JSONEntitySchema.array(),
      region: JSONEntitySchema.array(),
      continent: JSONEntitySchema.array(),
      city: JSONEntitySchema.array(),
      short_url: JSONEntitySchema.array(),
      original_url: JSONEntitySchema.array(),
      browser: JSONEntitySchema.array(),
      device: JSONEntitySchema.array(),
      os: JSONEntitySchema.array()
    }),
    stats: z.object({
      num_links: z.number(),
      link_clicks: z.number(),
      qr_clicks: z.number()
    }),
    combobox: z.object({
      source: ComboboxJSONEntitySchema.array(),
      country: ComboboxJSONEntitySchema.array(),
      region: ComboboxJSONEntitySchema.array(),
      continent: ComboboxJSONEntitySchema.array(),
      city: ComboboxJSONEntitySchema.array(),
      short_url: ComboboxJSONEntitySchema.array(),
      original_url: ComboboxJSONEntitySchema.array(),
      browser: ComboboxJSONEntitySchema.array(),
      device: ComboboxJSONEntitySchema.array(),
      os: ComboboxJSONEntitySchema.array()
    }),
    chart: z.object({
      date: z.string(),
      qr_count: z.number(),
      link_count: z.number()
    }).array()
  })
}).array().length(1).transform((arr) => {

  // Destructure current data
  const { tabs, combobox, chart, stats } = arr[0].data;

    // chart
    const renamedChart = chart.map(({ date, qr_count, link_count }) => ({ date: new Date(date), qrCount: qr_count, linkCount: link_count }));

    // stats
    const renamedStats = {
      numLinks: stats.num_links,
      linkClicks: stats.link_clicks,
      qrClicks: stats.qr_clicks
    }

    // Rename keys in tabs
    const { short_url, original_url, ...otherTabs } = tabs;
    const renamedTabs = {
      ...otherTabs,
      shortUrl: short_url,
      originalUrl: original_url,
    };

    // Rename keys in combobox
    const { short_url: cbShort, original_url: cbOriginal, ...otherCB } =
      combobox;
    const renamedCombobox = {
      ...otherCB,
      shortUrl: cbShort,
      originalUrl: cbOriginal,
    };

    return {
      stats: renamedStats,
      chart: renamedChart,
      tabs: renamedTabs,
      combobox: renamedCombobox,
    }
  });

const AnalayticsOutputSchema = z.object({
  tabs: z.object({
    source: JSONEntitySchema.array(),
    country: JSONEntitySchema.array(),
    region: JSONEntitySchema.array(),
    continent: JSONEntitySchema.array(),
    city: JSONEntitySchema.array(),
    shortUrl: JSONEntitySchema.array(),
    originalUrl: JSONEntitySchema.array(),
    browser: JSONEntitySchema.array(),
    device: JSONEntitySchema.array(),
    os: JSONEntitySchema.array()
  }),
  stats: z.object({
    numLinks: z.number(),
    linkClicks: z.number(),
    qrClicks: z.number()
  }),
  combobox: z.object({
    source: ComboboxJSONEntitySchema.array(),
    country: ComboboxJSONEntitySchema.array(),
    region: ComboboxJSONEntitySchema.array(),
    continent: ComboboxJSONEntitySchema.array(),
    city: ComboboxJSONEntitySchema.array(),
    shortUrl: ComboboxJSONEntitySchema.array(),
    originalUrl: ComboboxJSONEntitySchema.array(),
    browser: ComboboxJSONEntitySchema.array(),
    device: ComboboxJSONEntitySchema.array(),
    os: ComboboxJSONEntitySchema.array()
  }),
  chart: z.object({
    date: z.date(),
    qrCount: z.number(),
    linkCount: z.number()
  }).array()
});

const ComboboxSchema = z.object({
  source: ComboboxJSONEntitySchema.array(),
  country: ComboboxJSONEntitySchema.array(),
  region: ComboboxJSONEntitySchema.array(),
  continent: ComboboxJSONEntitySchema.array(),
  city: ComboboxJSONEntitySchema.array(),
  shortUrl: ComboboxJSONEntitySchema.array(),
  originalUrl: ComboboxJSONEntitySchema.array(),
  browser: ComboboxJSONEntitySchema.array(),
  device: ComboboxJSONEntitySchema.array(),
  os: ComboboxJSONEntitySchema.array()
})

export type ComboboxType = z.infer<typeof ComboboxSchema>;

export const AnalyticsServerResponseSchema = serverResponseSchema(AnalayticsOutputSchema);

export const RecordClickIfExistsSchema = ClickEventSchema.omit({
  id: true,
  linkId: true,
  createdAt: true,
}).extend({
  code: z.string().trim().length(12)
}).transform(data => {
    // now `data` has type: { code: string; source: 'qr'|'link'; city?: string; ... }
    return Object.fromEntries(
      Object.entries(data)
        .filter(([, v]) => v !== undefined)
        .map(([k,v]) => [snakeCase(k), v])
    );
  });

export type RecordClickIfExistsSchemaType = z.infer<typeof RecordClickIfExistsSchema>;

export namespace ClickEventSchemas {
  export const Click = ClickEventSchema; // used
  export const Create = ClickEventCreateSchema; // used
  // export const GetAll = ClickEventGetAllSchema;
  export const Fake = FakeClickEventSchema; // used
  export const Filter = ClickFilterSchema; // used
  export const Chart = ClickChartSchema; // used
  export const ClickResponse = FilterRepsonseSchema;
  export const ServerResponseFilter = ServerResponseFilterSchema; // used
  export const ServerResponsQuery = ServerResponseQuerySchema; // used
  export const JSONAgg = ClickJsonGetAllSchema; // used
  export const Query = JSONEntitySchema;
  export const AnalyticsJSON = AnalyticsJSONSchema;
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
  export type ServerResponseQuery = z.infer<typeof ServerResponseQuerySchema>;
  export type JSONAgg = z.infer<typeof ClickJsonGetAllSchema>;
  export type Query = z.infer<typeof JSONEntitySchema>;
  export type AnalyticsJSON = z.infer<typeof AnalyticsJSONSchema>;
}

/**
 * Given a Zod schema, this function returns a new schema which mirrors a ServerResponse that contains the
 * provided schema. This is very useful for validating the data returned from an API or Server Action.
 *
 * @param dataSchema
 * @returns
 */
export function serverResponseSchema<T>(dataSchema: z.ZodType<T>) {
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
