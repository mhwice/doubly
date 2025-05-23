import { LinkTable } from "@/data-access/links";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { getSession } from "@/lib/get-session";
import { ServerResponse } from "@/lib/server-repsonse";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {

  // 1 - Read and parse request params
  const searchParams = request.nextUrl.searchParams;
  const params = Array.from(searchParams.entries());

  // 2 - Validate the incoming data
  const LinkAllSchema = z.tuple([
    z.literal("dateEnd"),
    z.coerce.date(),
  ]).array().length(1).transform(([pair]) => ({ dateEnd: pair[1] }));

  const validated = LinkAllSchema.safeParse(params);
  if (!validated.success) console.log(validated.error)
  if (!validated.success) return NextResponse.json(ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS));

  // 3 - Get session data
  const session = await getSession();
  if (!session) return NextResponse.json(ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED));

  // 4 - Send request to DAL
  const response = await LinkTable.getAllLinks({
    userId: session.user.id,
    ...validated.data
  });

  // 5 - Handle DAL response
  return NextResponse.json(response);
}
