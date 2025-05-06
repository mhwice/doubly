import { DataTable } from "./components/data-table";
import { LinkTable } from "@/data-access/links"
import { redirect } from "next/navigation";
import { StatsHeader } from "./stats-header";
import { type LinkTypes } from "@/lib/zod/links";
import { getSession } from "@/lib/get-session";
import { ClientWrapper } from "./client-wrapper";
import { NewLinkButton } from "./new-link-button";

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
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row justify-between h-full md:items-center max-w-7xl mx-auto px-3 md:px-5 xl:px-10">
        <div className="h-full flex flex-col">
          <h1 className="font-semibold text-3xl mt-14 mb-2 text-vprimary">Link Management</h1>
          <p className="text-sm text-vsecondary w-[95%] lg:w-[700px] xl:w-[400px]">Create new short links, copy urls and qr codes, perform bulk actions on multiple links at once.</p>
        </div>
        <div className="mt-5 md:mt-14">
          <NewLinkButton />
        </div>
      </div>
      <div className="border-b border-vborder mt-14"></div>

      <div className="h-full flex flex-col max-w-7xl mx-auto px-3 md:px-5 xl:px-10">
        <ClientWrapper />
      </div>
    </div>
  )
}
