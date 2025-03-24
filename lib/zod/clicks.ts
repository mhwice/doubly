import { z } from 'zod';
import { LinkSchemas } from './links';

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

const ClickEventCreateSchema = ClickEventSchema.omit({
  id: true
});

const ClickEventGetAllSchema = ClickEventSchema.pick({
  linkId: true
});

/*

{
[
  { field: 'source', value: 'link', count: '7' },
  { field: 'source', value: 'qr', count: '3' },
  { field: 'country', value: null, count: '7' },
  { field: 'country', value: 'RO', count: '1' },
  { field: 'country', value: 'CA', count: '2' },
  { field: 'continent', value: null, count: '7' },
  { field: 'continent', value: 'NA', count: '2' },
  { field: 'continent', value: 'EU', count: '1' },
  { field: 'city', value: 'Duncan', count: '2' },
  { field: 'city', value: null, count: '7' },
  { field: 'city', value: 'Bucharest', count: '1' },
  {
    field: 'short_url',
    value: 'http://localhost:3000/lOvZLu',
    count: '1'
  },

*/

const ClickFilterSchema = z.object({
  field: z.string(), //z.enum(["source", "continent", "country", "city", "originalUrl", "shortUrl"]),
  value: z.string().optional(),//.trim().min(1).max(255).optional(),
  count: z.number()//z.preprocess(Number, z.number())
})

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
  export const Click = ClickEventSchema;
  export const Create = ClickEventCreateSchema;
  export const GetAll = ClickEventGetAllSchema;
  export const Fake = FakeClickEventSchema;
  export const Filter = ClickFilterSchema;
}

export namespace ClickEventTypes {
  export type Click = z.infer<typeof ClickEventSchema>;
  export type Create = z.infer<typeof ClickEventCreateSchema>;
  export type GetAll = z.infer<typeof ClickEventGetAllSchema>;
  export type Fake = z.infer<typeof FakeClickEventSchema>;
  export type Filter = z.infer<typeof ClickFilterSchema>;
}
