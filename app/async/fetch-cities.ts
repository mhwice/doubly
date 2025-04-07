"use client";

import { CitySR, ClickEventSchemas, ClickEventTypes } from '@/lib/zod/clicks';
import { deserialize, stringify } from 'superjson';

export type City = string;

export async function getCities(query?: string): Promise<ClickEventTypes.Filter[]> {

  // console.log("query", query)
  const res = await fetch("/api/city", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: stringify({ query })
  });
  const parsed = await res.json();
  const deserialized = deserialize(parsed);
  const validated = CitySR.safeParse(deserialized);
  if (!validated.success) throw new Error();
  const data = validated.data;
  if (!data.success) throw new Error();
  return data.data;
  // return deserialized as string[];
}
