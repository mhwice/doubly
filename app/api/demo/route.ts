import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

  setTimeout(() => {
    console.log("goodbye");
  }, 30_000);

  return NextResponse.json({ cool: "this has been fun" });
}
