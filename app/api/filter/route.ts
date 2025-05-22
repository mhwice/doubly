import { ClickEvents } from "@/data-access/clicks";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { getSession } from "@/lib/get-session";
import { ServerResponse } from "@/lib/server-repsonse";
import { FilterAPIParamsSchema } from "@/lib/zod/links";
import { NextRequest, NextResponse } from "next/server";

/**
 *
 * Takes in an array of key-value pairs representing the selected filters
 * as well as the date range
 * Does not take in a query string or a query field.
 *
 * Returns all data needed for StatsHeader, TabGroup, Chart, and Combobox.
 *
 * A different endpoint is responsible for the query strings.
 *
 */
export async function GET(request: NextRequest) {

  // 1 - Read and parse request params
  const searchParams = request.nextUrl.searchParams;
  const params = Array.from(searchParams.entries());

  // 2 - Validate the incoming data
  const validated = FilterAPIParamsSchema.safeParse(params);
  // if (!validated.success) return NextResponse.json(serialize(ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS)));
  if (!validated.success) return NextResponse.json(ServerResponse.fail(ERROR_MESSAGES.INVALID_PARAMS));

  // 3 - Get session data
  const session = await getSession();
  // if (!session) return NextResponse.json(serialize(ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED)));
  if (!session) return NextResponse.json(ServerResponse.fail(ERROR_MESSAGES.UNAUTHORIZED));

  // 4 - Send request to DAL
  const response = await ClickEvents.getFilteredData({
    userId: session.user.id,
    ...validated.data
  });

  // if (response.success) console.log({combobox: response.data.combobox.country})
  // console.log(serialize(response));

  // 5 - Handle DAL response
  return NextResponse.json(response);
  // return NextResponse.json(serialize(response));
}
