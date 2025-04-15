import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientWrapper } from "./client-wrapper";
import Link from "next/link";
import { LogoutButton } from "./logout-button";

export default async function Filter() {
  return (
    <div className="h-full mx-[5%]">
      {/* <div className="flex flex-row justify-between mt-8"> */}
        {/* <Tabs defaultValue="analytics" className="w-[500px]">
          <TabsList>
            <Link href="/dashboard" passHref>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </Link>
            <Link href="/analytics" passHref>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs> */}
        {/* <LogoutButton /> */}
      {/* </div> */}
      <ClientWrapper />
    </div>
  );
}
