import { ClickEvents } from "@/data-access/clicks";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { getSession } from "@/lib/get-session";
import { ServerResponse } from "@/lib/server-repsonse";
import { APIContents, FilterEnumType, LinkTypes } from "@/lib/zod/links";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { serialize, deserialize } from 'superjson';
import { ZodError } from "zod";

export async function POST(request: NextRequest) {

  // 1 - Read and parse request body
  let contents;
  try {
    const body = await request.json();
    contents = deserialize(body);
  } catch (error: unknown) {
    return NextResponse.json(serialize(ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS)));
    // return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS);
  }

  // 2 - Validate the incoming data
  const validated = APIContents.safeParse(contents);
  if (!validated.success) return NextResponse.json(serialize(ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS)));
  // if (!validated.success) return ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS)

  // 3 - Get session data
  const session = await getSession();
  if (!session) return NextResponse.json(serialize(ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED)));
  // if (!session) return ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED);

  // 3 - Send request to DAL
  const map: Map<FilterEnumType, string[]> = new Map();
  for (const [k, v] of validated.data.selectedValues) {
    if (!map.has(k)) map.set(k, []);
    map.get(k)?.push(v);
  }

  const response = await ClickEvents.getFilterMenuData({
    userId: session.user.id,
    options: map,
    ...validated.data
  });

  // 4 - Handle DAL response
  // return response;

  // if (error !== undefined) throw new Error(error);
  return NextResponse.json(serialize(response));
}
