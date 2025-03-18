/*

this is the search bar, filter options, and new link button that live
right above the table

for now just do search bar and new link button

*/

import { Input } from "@/components/ui/input";
import { NewLinkButton } from "./new-link-button";

export function TableHeader({ userId }: { userId: string }) {
  return (
    <div className="flex w-full justify-between my-1 py-1">
      <Input className="w-[300px] bg-white" placeholder="Filter links..."/>
      <NewLinkButton userId={userId} />
    </div>
  );
}
