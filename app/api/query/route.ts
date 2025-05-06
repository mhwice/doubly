import { ClickEvents } from "@/data-access/clicks";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { getSession } from "@/lib/get-session";
import { ServerResponse } from "@/lib/server-repsonse";
import { APIContents, FilterEnumType } from "@/lib/zod/links";
import { NextRequest, NextResponse } from "next/server";
import { serialize, deserialize } from 'superjson';

export async function POST(request: NextRequest) {

  // 1 - Read and parse request body
  let contents;
  try {
    const body = await request.json();
    contents = deserialize(body);
  } catch (error: unknown) {
    return NextResponse.json(serialize(ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS)));
  }

  // 2 - Validate the incoming data
  const validated = APIContents.safeParse(contents);
  if (!validated.success) console.log(validated.error)
  if (!validated.success) return NextResponse.json(serialize(ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS)));

  // 3 - Get session data
  const session = await getSession();
  if (!session) return NextResponse.json(serialize(ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED)));

  // 4 - Send request to DAL
  const map: Map<FilterEnumType, string[]> = new Map();
  for (const [k, v] of validated.data.selectedValues) {
    if (!map.has(k)) map.set(k, []);
    map.get(k)?.push(v);
  }

  const response = await ClickEvents.getQueriedData({
    userId: session.user.id,
    options: map,
    ...validated.data
  });

  // 5 - Handle DAL response

  // for testing a huge number of cities
  // if (response.success) {
  //   response.data.json.city = [];
  //   for (let i = 0; i < 1e4; i += 1) {
  //     response.data.json.city.push({
  //       value: `city${i}`,
  //       count: 3,
  //       percent: 2
  //     })
  //   }
  // }

  return NextResponse.json(serialize(response));
}
