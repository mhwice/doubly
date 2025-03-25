import { ClickEvents } from "@/data-access/clicks";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

/*
  Question. Should I load the user data here, or should I get it as an argument from the frontend?

*/
export async function POST(request: NextRequest) {
  const res: [string,string][] = await request.json();

  const map = new Map();
  for (const [k, v] of res || []) {
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
  const { data, error } = await ClickEvents.getFilterMenuData({ userId, options: map });
  // for (const [k, v] of res) {
  //   console.log(k, v);
  // }

  if (error !== undefined) throw new Error(error);
  return NextResponse.json({ data });
}
