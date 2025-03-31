import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { LinkTable } from "@/data-access/links"
import { redirect } from "next/navigation";
import { StatsHeader } from "@/app/dashboard/stats-header";
import { type LinkTypes } from "@/lib/zod/links";
// import { UserProvider } from "./UserContext";
import { TableHeader } from "./table-header";
import { getSession } from "@/lib/get-session";
import { ClickEvents } from "@/data-access/clicks";
import { ClickEventTypes } from "@/lib/zod/clicks";
import { ChartAreaInteractive } from "./chart-area-interactive";

// TODO - it might be a better idea to query this from the db directly
function makeStats(links: LinkTypes.DTO[]) {
  let numUrls = 0;
  let numLinkClicks = 0;
  let numQRClicks = 0;
  for (const { linkClicks, qrClicks } of links) {
    numUrls += 1;
    numLinkClicks += linkClicks;
    numQRClicks += qrClicks;
  }

  return { numUrls, numLinkClicks, numQRClicks };
}

export default async function DemoPage() {

  const session = await getSession();
  if (!session) redirect("/");
  const userId = session.user.id;

  const { data: links, error } = await LinkTable.getAllLinks({ userId });
  if (error !== undefined) throw new Error(error);

  const { data: clicks, error: clickError } = await ClickEvents.getAllClicks({ userId });
  if (clickError !== undefined) throw new Error(clickError);

  const stats = makeStats(links);

  return (
    // <UserProvider userId={userId}></UserProvider>
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <StatsHeader stats={stats} />
      </div>
      <ChartAreaInteractive clickEvents={groupByDay(clicks)}/>
      <div className="mb-8"></div>
      <TableHeader />
      <DataTable data={links} columns={columns} />
    </div>
  )
}


function groupByDay(clickEvents: ClickEventTypes.Click[]) {
  const qrCounter = new Map<string, number>();
  const linksCounter = new Map<string, number>();

  for (const { createdAt, source } of clickEvents) {
    const day = createdAt.toISOString().split("T")[0];
    qrCounter.set(day, (qrCounter.get(day) || 0) + (source === "qr" ? 1 : 0));
    linksCounter.set(day, (linksCounter.get(day) || 0) + (source === "link" ? 1 : 0));
  }

  const result: { day: string; qr: number; link: number }[] = [];
  for (const day of qrCounter.keys()) {
    result.push({
      day,
      qr: qrCounter.get(day) || 0,
      link: linksCounter.get(day) || 0,
    });
  }

  result.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

  return result;
}
