import { ClickEvents } from "@/data-access/clicks";
import { Combobox } from "./combobox";
import { MultiPageCommand } from "./demo";
import Example from "./ex";
import { createMenu } from "./getData"
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { ClickEventTypes } from "@/lib/zod/clicks";

export default async function Filter() {
  // const menu = await createMenu();

  const session = await getSession();
  if (!session) redirect("/");
  const userId = session.user.id;

  const { data, error } = await ClickEvents.getFilterMenuData({ userId });
  if (error !== undefined) throw new Error(error);

  // can now pass data to menu?
  const menu = buildMenu(data);

  return (
    <div className="flex justify-center items-center h-full">
      <Combobox filterFields={menu}/>
      {/* <Example /> */}
      {/* <MultiPageCommand /> */}
    </div>
  );
}

type MenuItem = {
  label: string;
  count: number;
  sub?: MenuItem[];
};

function buildMenu(filterFields: ClickEventTypes.Filter): MenuItem {
  const menu: MenuItem = { label: "root", count: -1, sub: [] };

  for (const [k, v] of Object.entries(filterFields)) {
    if (Array.isArray(v) && menu.sub) {
      const item: MenuItem = {
        label: k,
        count: v.length,
        sub: v.map((x) => ({ label: x === undefined ? "unknown" : String(x), count: 0 })),
      };

      menu.sub.push(item);
    }
  }

  return menu;
}
