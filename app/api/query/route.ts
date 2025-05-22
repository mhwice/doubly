import { ClickEvents } from "@/data-access/clicks";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { getSession } from "@/lib/get-session";
import { ServerResponse } from "@/lib/server-repsonse";
import { QuerySchema } from "@/lib/zod/links";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

  // 1 - Read and parse request params
  const searchParams = request.nextUrl.searchParams;
  const params = Array.from(searchParams.entries());

  // await sleep(300)
  // console.log(params)

  // 2 - Validate the params
  const validated = QuerySchema.safeParse(params);
  // if (!validated.success) console.log(validated.error)
  if (!validated.success) return NextResponse.json(ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS));
  // if (!validated.success) return NextResponse.json(serialize(ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS)));

  // 3 - Get session data
  const session = await getSession();
  if (!session) return NextResponse.json(ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED));
  // if (!session) return NextResponse.json(serialize(ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED)));

  // 4 - Send request to DAL
  const response = await ClickEvents.getQueriedData({
    userId: session.user.id,
    ...validated.data
  });

  // 5 - Handle DAL response
  // return NextResponse.json(serialize(response));
  return NextResponse.json(response);
}
