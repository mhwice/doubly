"use client";

import { Dispatch, SetStateAction } from "react";
import { Tag } from "./tag";

interface TagGroupProps {
  selectedValues: string[][],
  onRemoveTag: (tag: string[]) => void
}

export function TagGroup({ selectedValues, onRemoveTag }: TagGroupProps) {
  return (
    <div className="w-full py-4">
      {selectedValues.map(([k, v]) => <Tag key={`${k},${v}`} k={k} v={v} onRemove={() => onRemoveTag([k, v])} />)}
    </div>
  );
}

/*

I have 3 components: Parent, TagGroup, Tag. The Parent component renders a single TagGroup. The TagGroup component renders many Tag components.

The Parent component has some state called 'selectedValues' like this:

const [selectedValues, setSelectedValues] = useState<string[][]>([]);

For each entry in selectedValues, I want to render a new Tag.

A Tag also has a button, which when clicked, will remove that entry from selectedValues.

What is the best way to achieve this? Should selectedValues and setSelectedValues be passed to TagGroup who then passes them to every Tag instance? Or is there a better way?





*/
