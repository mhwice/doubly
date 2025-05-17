import { z } from "zod";

// TODO - check what happens if I insert a lat/lng into the db with too much precision
//        such as 1.2345678901234567890123456789012345678901234567890
export const ClickEventSchema = z.object({
  id: z.number().nonnegative().lt(2_147_483_648),
  linkId: z.number().nonnegative().lt(2_147_483_648),
  source: z.enum(["qr", "link"]),
  createdAt: z.date(),
  country: z.string().trim().min(1).max(63),
  continent: z.string().trim().min(1).max(63),
  region: z.string().trim().min(1).max(63),
  city: z.string().trim().min(1).max(63),
  latitude: z.number().gte(-90).lte(90).optional(),
  longitude: z.number().gte(-180).lte(180).optional(),
  device: z.string().trim().min(1),
  browser: z.string().trim().min(1),
  os: z.string().trim().min(1),
});

export type Click = z.infer<typeof ClickEventSchema>;
