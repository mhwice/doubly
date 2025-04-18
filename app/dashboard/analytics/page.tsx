import { ClientWrapper } from "./client-wrapper";
import { LogoutButton } from "./logout-button";

export default async function Filter() {
  return (
    <div className="bg-[var(--dashboard-bg)] p-0 m-0">
      <div className="h-full mx-[15%]">
        {/* <div className="flex flex-row justify-between mt-8"> */}
          {/* <LogoutButton /> */}
        {/* </div> */}
        <ClientWrapper />
      </div>
    </div>
  );
}
