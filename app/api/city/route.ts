import { ClickEvents } from "@/data-access/clicks";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { getSession } from "@/lib/get-session";
import { ServerResponse } from "@/lib/server-repsonse";
import { APIContents, CityLookup, FilterEnumType, LinkTypes } from "@/lib/zod/links";
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
  }

  // 2 - Validate the incoming data
  const validated = CityLookup.safeParse(contents);
  if (!validated.success) return NextResponse.json(serialize(ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS)));

  // 3 - Get session data
  const session = await getSession();
  if (!session) return NextResponse.json(serialize(ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED)));

  // 3 - Send request to DAL
  const response = await ClickEvents.getCities({
    userId: session.user.id,
    ...validated.data
  });

  // 4 - Handle DAL response
  return NextResponse.json(serialize(response));
}
