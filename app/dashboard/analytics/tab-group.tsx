import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from "react";

interface TabGroupParams {
  items: {
    title: string,
    value: string,
    children: React.ReactNode
  }[]
}

export function TabGroup({ items }: TabGroupParams) {
  return (
    <>
      {items.length > 0 && (
        <Tabs defaultValue={items[0].value} className="w-full lg:w-[500px]">
        <TabsList>{items.map(({ title, value }) => <TabsTrigger key={value} value={value}>{title}</TabsTrigger>)}</TabsList>
        {items.map(({ value, children }) => <TabsContent key={value} value={value}>{children}</TabsContent>)}
      </Tabs>
      )}
    </>
  );
}
