"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagProps {
  k: string,
  v: string,
  onRemove: () => void;
}

export function Tag({ k, v, onRemove }: TagProps) {
  return (
    <Badge key={`${k},${v}`} variant="secondary" className="mx-1 bg-vborder">
      <span className="font-normal text-vsecondary">{v}</span>
      <button className="ml-1 py-1 pl-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2" onClick={onRemove}>
        <X className="h-3 w-3 text-vsecondary hover:text-vprimary" />
      </button>
    </Badge>
  );
}

// export function Tag({ k, v }: TagProps) {
//   return (
//     <Badge key={`${k},${v}`} variant="outline" style={badgeStyle("#ef4444")} className="mb-2 mr-2">
//       {k + ": " + v}
//     </Badge>
//   );
// }

const badgeStyle = (color: string) => ({
  borderColor: `${color}20`,
  backgroundColor: `${color}30`,
  color,
});
