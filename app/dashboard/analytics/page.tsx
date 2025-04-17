import { ClientWrapper } from "./client-wrapper";
import { LogoutButton } from "./logout-button";

export default async function Filter({ now }: { now: string }) {
  return (
    <div className="h-full mx-[15%]">
      {/* <div className="flex flex-row justify-between mt-8"> */}
        {/* <LogoutButton /> */}
      {/* </div> */}
      <ClientWrapper />
    </div>
  );
}
