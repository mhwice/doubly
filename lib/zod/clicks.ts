import { z } from 'zod';
import { snakeCase } from 'change-case';
import { serverResponseSchema } from './server-response-schema';
import { ClickEventSchema } from '../schemas/click/click.entity';

export const ClickRecord = ClickEventSchema.omit({
  id: true,
  createdAt: true
}).extend({
  createdAt: z.string()
}).transform((data) => {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined).map(([key, value]) => [snakeCase(key), value])
  );
});

export const ClickEventCreateSchema = ClickEventSchema.omit({
  id: true
}).transform((data) => {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined).map(([key, value]) => [snakeCase(key), value])
  );
});

const ClickChartSchema = z.object({
  date: z.date(),
  qrCount: z.number(),
  linkCount: z.number()
})

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

export const ComboboxJSONEntitySchema = z.object({
  value: z.string(),
  count: z.number(),
  label: z.string()
});

export const AnalyticsJSONSchema = z.object({
  data: z.object({
    empty: z.boolean(),
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
  const { empty, tabs, combobox, chart, stats } = arr[0].data;

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
      empty: empty,
      stats: renamedStats,
      chart: renamedChart,
      tabs: renamedTabs,
      combobox: renamedCombobox,
    }
  });

const AnalayticsOutputSchema = z.object({
  empty: z.boolean(),
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

export const ServerResponseComboboxSchema = serverResponseSchema(ComboboxJSONEntitySchema.array());
export const AnalyticsServerResponseSchema = serverResponseSchema(AnalayticsOutputSchema);

export type ComboboxQuery = z.infer<typeof ComboboxJSONEntitySchema>;
export type ComboboxType = z.infer<typeof ComboboxSchema>;
export type RecordClickIfExistsSchemaType = z.infer<typeof RecordClickIfExistsSchema>;

export type ClickEventCreateType = z.infer<typeof ClickEventCreateSchema>;
export type ClickChartChart = z.infer<typeof ClickChartSchema>;
export type ClickJsonGetAllType = z.infer<typeof ClickJsonGetAllSchema>;
export type AnalyticsJSONType = z.infer<typeof AnalyticsJSONSchema>;
