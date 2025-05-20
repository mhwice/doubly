import { ClientWrapper } from "./client-wrapper";
import { NewLinkButton } from "./new-link-button";

export default async function LinksPage() {
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
