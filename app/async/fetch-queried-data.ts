// "use client";

// import { CitySR, ClickEventSchemas, ClickEventTypes } from '@/lib/zod/clicks';
// import { FilterEnumType } from '@/lib/zod/links';
// import { deserialize, stringify } from 'superjson';

// export type City = string;

// interface FetchQueriedDataProps {
//   query?: string,
//   field: FilterEnumType
// }

// export async function fetchQueriedData(params: FetchQueriedDataProps): Promise<ClickEventTypes.Filter[]> {

//   // 1 - Client-side validation
//   // Actually, i don't even think I should be doing any validation in here.....
//   // const validated = await SomeZodValidator.safeParse(params);
//   // if (!validated.success)

//   // 2 - Hit API endpoint
//   // 3 - Parse & Validate API response
//   // 4 - Return result



//   // console.log("query", query)
//   const res = await fetch("/api/city", {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: stringify({ query })
//   });
//   const parsed = await res.json();
//   const deserialized = deserialize(parsed);
//   const validated = CitySR.safeParse(deserialized);
//   if (!validated.success) throw new Error();
//   const data = validated.data;
//   if (!data.success) throw new Error();
//   return data.data;
//   // return deserialized as string[];
// }
