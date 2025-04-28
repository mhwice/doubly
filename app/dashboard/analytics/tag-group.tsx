"use client";

import { JSX } from "react";
import { useCurrentFilters } from "../filters-context";
import { Tag } from "./tag";

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
  })


  return (
    <div className="w-full py-4">
      {tags}
    </div>
  );
}
