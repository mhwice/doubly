import { ClickEvents } from "@/data-access/clicks";
import { ERROR_MESSAGES } from "@/lib/error-messages";
import { getSession } from "@/lib/get-session";
import { APIContents, FilterEnumType, LinkTypes } from "@/lib/zod/links";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { serialize, deserialize } from 'superjson';
import { ZodError } from "zod";

export async function POST(request: NextRequest) {

  let parsedContents;
  try {
    const body = await request.json();
    const contents = deserialize(body);
    parsedContents = APIContents.parse(contents);

  } catch (error: unknown) {
    if (error instanceof ZodError) return { error: ERROR_MESSAGES.INVALID_PARAMS };
      return { error: ERROR_MESSAGES.DATABASE_ERROR };
  }

  const map: Map<FilterEnumType, string[]> = new Map();
  for (const [k, v] of parsedContents.selectedValues) {
    if (!map.has(k)) map.set(k, []);
    map.get(k)?.push(v);
  }

  // TODO - does this need to be try-catched?
  // no, getSession returns null if there is a failure.
  const session = await getSession();
  if (!session) redirect("/");
  const userId = session.user.id;

  const payload: LinkTypes.GetAll = { userId, options: map, dateRange: parsedContents.dateRange };
  const response = await ClickEvents.getFilterMenuData(payload);

  if (!response.success) throw new Error(response.error);

  return NextResponse.json(serialize(response.data));
}
