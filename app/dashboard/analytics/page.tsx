import { ClientWrapper } from "./client-wrapper";

export default async function Filter() {
  return (
    <>
      <div className="h-full mx-[15%] flex flex-col">
        <h1 className="font-semibold text-3xl mt-14 mb-2 text-vprimary">Click Analytics</h1>
        <p className="text-sm text-vsecondary">Collect valuable insights on user behaviour and site performance<br/>with detailed page view metrics. Gain knowledge on top pages.</p>
      </div>
      <div className="border-b border-vborder mt-14"></div>

      <div className="h-full mx-[15%] flex flex-col">
        <ClientWrapper />
      </div>
    </>
  );
}
