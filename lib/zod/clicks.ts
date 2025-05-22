import { z } from 'zod';
import { snakeCase } from 'change-case';
import { serverResponseSchema } from './server-response-schema';
import { ClickEventSchema } from '../schemas/click/click.entity';

/* Single item */
export const ComboboxEntrySchema = z.object({
  value: z.string(),
  count: z.number(),
  label: z.string()
})

/* Single page of items */
export const ComboboxPageSchema = ComboboxEntrySchema.array();

/* All pages */
const ComboboxSchema = z.object({
  source: ComboboxPageSchema,
  country: ComboboxPageSchema,
  region: ComboboxPageSchema,
  continent: ComboboxPageSchema,
  city: ComboboxPageSchema,
  shortUrl: ComboboxPageSchema,
  originalUrl: ComboboxPageSchema,
  browser: ComboboxPageSchema,
  device: ComboboxPageSchema,
  os: ComboboxPageSchema,
});

const removeEmptyKeys = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );
}

// function removeEmptyKeys<T extends object>(obj: T): Partial<T> {
//   return Object.fromEntries(
//     Object.entries(obj)
//       .filter(([, v]) => v !== undefined)
//   ) as Partial<T>;
// }

// function objToSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
//   return Object.fromEntries(
//     Object.entries(obj)
//       .map(([k, v]) => [snakeCase(k), v])
//   );
// }

const objToSnakeCase = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [snakeCase(key), value])
  );
}

export const ClickPayloadSchema = ClickEventSchema.omit({
  id: true,
}).transform((data) => {
  const x = removeEmptyKeys(data);
  const y = objToSnakeCase(x);
  return y;
});

const ClickChartSchema = z.object({
  date: z.coerce.date(),
  qrCount: z.number(),
  linkCount: z.number()
}).array()

const GroupedDataSchema = z.object({
  value: z.string(),
  count: z.number(),
  percent: z.number(),
  label: z.string()
}).array();

const AllGroupedDataSchema = z.object({
  source: GroupedDataSchema,
  country: GroupedDataSchema,
  region: GroupedDataSchema,
  continent: GroupedDataSchema,
  city: GroupedDataSchema,
  shortUrl: GroupedDataSchema,
  originalUrl: GroupedDataSchema,
  browser: GroupedDataSchema,
  device: GroupedDataSchema,
  os: GroupedDataSchema,
});

export const AnalyticsReadSchema = z.object({
  data: z.object({
    empty: z.boolean(),
    tabs: z.object({
      source: GroupedDataSchema,
      country: GroupedDataSchema,
      region: GroupedDataSchema,
      continent: GroupedDataSchema,
      city: GroupedDataSchema,
      short_url: GroupedDataSchema,
      original_url: GroupedDataSchema,
      browser: GroupedDataSchema,
      device: GroupedDataSchema,
      os: GroupedDataSchema,
    }),
    stats: z.object({
      num_links: z.number(),
      link_clicks: z.number(),
      qr_clicks: z.number()
    }),
    combobox: z.object({
      source: ComboboxPageSchema,
      country: ComboboxPageSchema,
      region: ComboboxPageSchema,
      continent: ComboboxPageSchema,
      city: ComboboxPageSchema,
      short_url: ComboboxPageSchema,
      original_url: ComboboxPageSchema,
      browser: ComboboxPageSchema,
      device: ComboboxPageSchema,
      os: ComboboxPageSchema,
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
  tabs: AllGroupedDataSchema,
  stats: z.object({
    numLinks: z.number(),
    linkClicks: z.number(),
    qrClicks: z.number()
  }),
  combobox: ComboboxSchema,
  chart: ClickChartSchema
});

export const ServerResponseComboboxPageSchema = serverResponseSchema(ComboboxPageSchema);
export const ServerResponseAnalyticsOutputSchema = serverResponseSchema(AnalayticsOutputSchema);

export type ComboboxPage = z.infer<typeof ComboboxPageSchema>;
export type Combobox = z.infer<typeof ComboboxSchema>;
export type ClickPayload = z.infer<typeof ClickPayloadSchema>;
export type ClickChart = z.infer<typeof ClickChartSchema>;
export type AllGroupedData = z.infer<typeof AllGroupedDataSchema>;
export type AnalyticsRead = z.infer<typeof AnalyticsReadSchema>;
