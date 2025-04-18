import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { LinkTable } from "@/data-access/links"
import { redirect } from "next/navigation";
import { StatsHeader } from "./stats-header";
import { type LinkTypes } from "@/lib/zod/links";
import { getSession } from "@/lib/get-session";
import { ClientWrapper } from "./client-wrapper";

// TODO - it might be a better idea to query this from the db directly
function makeStats(links: LinkTypes.Dashboard[]) {
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

export default async function LinksPage() {

  // const session = await getSession();
  // if (!session) redirect("/");
  // const userId = session.user.id;

  // const currentDate = new Date();

  // const response = await LinkTable.getAllLinks({
  //   userId: userId,
  //   options: new Map(),
  //   dateRange: [undefined, currentDate]
  // });

  // if (!response.success) throw new Error(response.error);
  // const links = response.data;

  // const stats = makeStats(links);

  return (
    <div className="bg-[var(--dashboard-bg)] h-full">
      <ClientWrapper />
    </div>
    // <div className="h-full mx-[15%]">
    //   <div className="mb-8 mt-8">
    //     <StatsHeader stats={stats} />
    //   </div>
    //   <div className="mb-8"></div>
    //   <DataTable data={links} columns={columns} />
    // </div>
  )
}
