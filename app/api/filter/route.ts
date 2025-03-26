import { ClickEvents } from "@/data-access/clicks";
import { getSession } from "@/lib/get-session";
import { LinkTypes } from "@/lib/zod/links";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from 'superjson';

/*
  Question. Should I load the user data here, or should I get it as an argument from the frontend?

*/

interface RequestType {
  selectedData: [string, string][],
  dateRange: [string, string]
}

export async function POST(request: NextRequest) {
  // console.log(await request.json())

  // await ClickEvents.getCoords();

  // return NextResponse.json("done");
  const res: RequestType = await request.json();

  const map = new Map();
  for (const [k, v] of res?.selectedData || []) {
    map.set(k, (map.get(k) || new Set()).add(v));
  }

  for (const [k, vs] of map) {
    map.set(k, Array.from(vs));
  }

  const session = await getSession();
  if (!session) redirect("/");
  const userId = session.user.id;

  // now I need to send these to the clickevents function
  // should I pass the userId from the client?
  const payload: LinkTypes.GetAll = { userId, options: map, dateRange: res?.dateRange ? { start: res.dateRange[0], end: res.dateRange[1] } : undefined };
  const { data, error } = await ClickEvents.getFilterMenuData(payload);
  // for (const [k, v] of res) {
  //   console.log(k, v);
  // }

  if (error !== undefined) throw new Error(error);

  return NextResponse.json(serialize(data));

  return NextResponse.json({ data });
}
