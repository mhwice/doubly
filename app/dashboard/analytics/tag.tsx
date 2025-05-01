"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cleanUrl } from "../links/components/columns";

interface TagProps {
  k: string,
  v: string,
  onRemove: () => void;
}

export function Tag({ k, v, onRemove }: TagProps) {
  return (
    <Badge key={`${k},${v}`} variant="secondary" className="mx-1 bg-vborder">
      <span className="font-normal text-vsecondary">{cleanUrl(v)}</span>
      <button className="ml-1 py-1 pl-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2" onClick={onRemove}>
        <X className="h-3 w-3 text-vsecondary hover:text-vprimary" />
      </button>
    </Badge>
  );
}
