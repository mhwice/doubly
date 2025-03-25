import { ClickEvents } from "@/data-access/clicks";
import { Combobox } from "./combobox";
import { MultiPageCommand } from "./demo";
import Example from "./ex";
import { createMenu } from "./getData"
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { ClickEventTypes } from "@/lib/zod/clicks";
import { ClientWrapper } from "./client-wrapper";

export default async function Filter() {

  const session = await getSession();
  if (!session) redirect("/");
  const userId = session.user.id;

  // const { data, error } = await ClickEvents.getFilterMenuData({ userId });
  // if (error !== undefined) throw new Error(error);

  // const menu = buildMenu(data);

  return (
    <div className="flex justify-center items-center h-full">
      {/* <Combobox filterFields={menu} selectedValues={} setSelectedValues={} /> */}
      <ClientWrapper userId={userId} />
    </div>
  );
}

// type MenuItem = {
//   label: string;
//   count: number;
//   sub?: MenuItem[];
// };

// function buildMenu(dbResponse: ClickEventTypes.Filter[]): MenuItem {
//   const menu: MenuItem = { label: "root", count: -1, sub: [] };

//   const map = new Map<string, [string, number][]>();
//   for (const { field, value, count } of dbResponse) {
//     if (!map.has(field)) map.set(field, []);
//     map.get(field)!.push([value ?? "unknown", count]);
//   }
//   for (const [field, items] of map) {
//     if (menu.sub) {
//       const menuItem: MenuItem = {
//         label: field,
//         count: items.length,
//       }

//       if (items.length > 0) {
//         menuItem.sub = items.map(([label, count]) =>({
//           label,
//           count
//         }));
//       }

//       menu.sub.push(menuItem);
//     }
//   }

//   return menu;
// }
