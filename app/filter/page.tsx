import { Combobox } from "./combobox";
import { MultiPageCommand } from "./demo";
import Example from "./ex";
import { createMenu } from "./getData"

export default async function Filter() {
  const menu = await createMenu();
  return (
    <div className="flex justify-center items-center h-full">
      <Combobox filterFields={menu} />
      {/* <Example /> */}
      {/* <MultiPageCommand /> */}
    </div>
  );
}
