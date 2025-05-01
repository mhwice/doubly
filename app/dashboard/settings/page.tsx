import DeleteAccountCard from "./delete-account-card";

export default function SettingsPage() {
  return (
    <>
      {/* <div className="mx-[15%] flex flex-col"> */}
      <div className="max-w-7xl mx-auto px-3 md:px-5 xl:px-10 flex flex-col">
        <h1 className="font-semibold text-3xl mt-14 mb-2 text-vprimary">Settings</h1>
      </div>
      <div className="border-b border-vborder mt-14"></div>
      <div className="flex-1 max-w-7xl mx-auto px-3 md:px-5 xl:px-10 flex flex-col pt-10 items-center">
      {/* <div className="flex-1 mx-[15%] flex flex-col pt-10 items-center"> */}
        <DeleteAccountCard />
      </div>
    </>
  );
}
