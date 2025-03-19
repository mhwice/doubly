import { z } from 'zod';

// TODO - check what happens if I insert a lat/lng into the db with too much precision
//        such as 1.2345678901234567890123456789012345678901234567890
const ClickEventSchema = z.object({
  id: z.number().nonnegative().lt(2_147_483_648),
  linkId: z.number().nonnegative().lt(2_147_483_648),
  source: z.enum(["qr", "link"]),
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

export namespace ClickEventSchemas {
  export const Click = ClickEventSchema;
  export const Create = ClickEventCreateSchema;
}

export namespace ClickEventTypes {
  export type Click = z.infer<typeof ClickEventSchema>;
  export type Create = z.infer<typeof ClickEventCreateSchema>;
}
