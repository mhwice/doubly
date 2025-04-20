import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabStuff } from "./tab-content";
import React from "react";

// Make this flexible so I can re-use with any kind of content!

type TabData = {
  title: string;
  count: number;
  percent: number;
}

interface TabGroupParams {
  items: {
    title: string,
    value: string,
    children: React.ReactNode
  }[]
}

/*

[
  {
    title: string,
    children: react.reactnode
  }
]

*/

export function TabGroup({ items }: TabGroupParams) {
  return (
    <>
      {items.length > 0 && (
        <Tabs defaultValue={items[0].value} className="w-[500px]">
        <TabsList>{items.map(({ title, value }) => <TabsTrigger key={value} value={value}>{title}</TabsTrigger>)}</TabsList>
        {items.map(({ value, children }) => <TabsContent key={value} value={value}>{children}</TabsContent>)}
      </Tabs>
      )}
    </>
  );
}
