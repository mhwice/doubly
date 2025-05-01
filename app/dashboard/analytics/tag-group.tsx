"use client";

import { JSX } from "react";
import { useCurrentFilters } from "../filters-context";
import { Tag } from "./tag";
import { Button } from "@/components/ui/button";

interface TagGroupProps {
  selectedValues: string[][],
  onRemoveTag: (tag: string[]) => void
}

export function TagGroup() {
  const { filters, addFilter, hasFilter, deleteFilter, clearFilters } = useCurrentFilters();

  const tags: JSX.Element[] = []
  filters.forEach((values, field) => {
    values.forEach((value) => {
      tags.push(
        <Tag
          key={`${field}-${value}`}
          k={field}
          v={value}
          onRemove={() => deleteFilter(field, value)}
        />
      )
    })
  });

  return (
    <div className="w-full py-4">
      {tags}
      {filters.size > 0 && <Button className="text-vprimary text-xs font-normal" variant="link" onClick={clearFilters}>Clear Filters</Button>}
    </div>
  );
}
