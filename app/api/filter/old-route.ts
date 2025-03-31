import { ClickEvents, ERROR_MESSAGES } from "@/data-access/clicks";
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
    if (error instanceof ZodError) return { error: ERROR_MESSAGES.PARSING };
      return { error: ERROR_MESSAGES.DB_ERROR };
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
  const { data, error } = await ClickEvents.getFilterMenuData(payload);

  if (error !== undefined) throw new Error(error);

  return NextResponse.json(serialize(data));
}
