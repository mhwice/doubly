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

const LinkGetAllSchema = LinkTableSchema.pick({
  userId: true
});

export namespace LinkSchemas {
  export const Table = LinkTableSchema;
  export const Create = LinkCreateSchema;
  export const Delete = LinkDeleteSchema;
  export const DTO = LinkDTOSchema;
  export const GetAll = LinkGetAllSchema;
  export const Lookup = LinkLookupSchema;
}

export namespace LinkTypes {
  export type Link = z.infer<typeof LinkTableSchema>;
  export type Create = z.infer<typeof LinkCreateSchema>;
  export type Delete = z.infer<typeof LinkDeleteSchema>;
  export type DTO = z.infer<typeof LinkDTOSchema>;
  export type Id = Delete["id"];
  export type Lookup = z.infer<typeof LinkLookupSchema>;
  export type GetAll = z.infer<typeof LinkGetAllSchema>;
}
