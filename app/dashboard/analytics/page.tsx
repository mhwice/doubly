import { ClientWrapper } from "./client-wrapper";

export default async function Filter({ searchParams }: { searchParams: Promise<{ shortUrl?: string }>}) {
  // const { shortUrl } = await searchParams;

  return (
    <>
      {/* <div className="h-full mx-[15%] flex flex-col"> */}
      <div className="h-full max-w-7xl mx-auto px-3 md:px-5 xl:px-10 flex flex-col">
        <h1 className="font-semibold text-3xl mt-14 mb-2 text-vprimary">Click Analytics</h1>
        <p className="text-sm text-vsecondary w-[400px] sm:w-full xl:w-[400px]">Collect valuable insights on user behaviour and site performance with detailed page view metrics. Gain knowledge on top pages.</p>
      </div>
      <div className="border-b border-vborder mt-14"></div>

      {/* <div className="h-full mx-[15%] flex flex-col"> */}
      <div className="h-full max-w-7xl mx-auto px-3 md:px-5 xl:px-10 flex flex-col">
        <ClientWrapper />
      </div>
    </>
  );
}
