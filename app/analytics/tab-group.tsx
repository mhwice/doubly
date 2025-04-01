import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabStuff } from "./tab-content";

const continents = [
  { title: "North America", count: 83, percent: Math.floor(83/83*100) },
  { title: "Europe", count: 36, percent: Math.floor(36/83*100) },
  { title: "Asia", count: 10, percent: Math.floor(10/83*100) },
  { title: "Africa", count: 9, percent: Math.floor(9/83*100) },
  { title: "South America", count: 4, percent: Math.floor(4/83*100) },
];

const countries = [
  { title: "Canada", count: 321, percent: Math.floor(321/321*100) },
  { title: "Mexico", count: 308, percent: Math.floor(308/321*100) },
  { title: "England", count: 273, percent: Math.floor(273/321*100) },
  { title: "China", count: 104, percent: Math.floor(104/321*100) },
  { title: "Brazil", count: 99, percent: Math.floor(99/321*100) },
];

const cities = [
  { title: "Duncan", count: 877, percent: Math.floor(877/877*100) },
  { title: "Burlington", count: 404, percent: Math.floor(404/877*100) },
  { title: "London", count: 85, percent: Math.floor(85/877*100) },
  { title: "Hong Kong", count: 84, percent: Math.floor(84/877*100) },
  { title: "Sao Paulo", count: 2, percent: Math.floor(2/877*100) },
];

type TabData = {
  title: string;
  count: number;
  percent: number;
}

interface TabGroupParams {
  countries: TabData[],
  cities: TabData[],
  continents: TabData[],
}


export function TabGroup(params: TabGroupParams) {
  return (
    <Tabs defaultValue="continent" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="continent">Continent</TabsTrigger>
        <TabsTrigger value="country">Country</TabsTrigger>
        <TabsTrigger value="city">City</TabsTrigger>
      </TabsList>
      <TabsContent value="continent"><TabStuff title="Top Continents" data={params.continents}/></TabsContent>
      <TabsContent value="country"><TabStuff title="Top Countries" data={params.countries}/></TabsContent>
      <TabsContent value="city"><TabStuff title="Top Cities" data={params.cities}/></TabsContent>
    </Tabs>
  );
}
