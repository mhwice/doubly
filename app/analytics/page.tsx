import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientWrapper } from "./client-wrapper";
import Link from "next/link";

export default async function Filter() {
  return (
    <div className="h-full mx-[5%]">
      <Tabs defaultValue="analytics" className="w-[500px] my-5">
        <TabsList>
          <Link href="/dashboard" passHref>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </Link>
          <Link href="/analytics" passHref>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      <ClientWrapper />
    </div>
  );
}
