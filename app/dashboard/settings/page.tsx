import DeleteAccountCard from "./delete-account-card";

export default function SettingsPage() {
  return (
    <div className="bg-[var(--dashboard-bg)]">
      <div className="h-full mx-[15%] flex flex-col">
        <h1 className="font-medium text-3xl mt-14 mb-2">Settings</h1>
      </div>
      <div className="border-b border-[var(--border-color)] mt-14"></div>
      <div className="h-full mx-[15%] flex flex-col pt-10 pb-[250px]">
        <DeleteAccountCard />
      </div>
    </div>
  );
}
