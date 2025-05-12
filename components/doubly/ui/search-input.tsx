"use client";

import { Search } from "lucide-react";
import { CustomInputProps, Input } from "./input";
import { Kbd } from "@/app/dashboard/analytics/kbd";
import { Dispatch, SetStateAction } from "react";

interface SearchInputProps extends CustomInputProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

export function SearchInput({ value, setValue, ...props }: SearchInputProps) {
  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      prefix={<Search size={16} />}
      prefixStyling={false}
      onKeyDown={(e) => {
        console.log(e.key);
        if (e.key === "Escape") setValue("");
      }}
      suffix={
        value.length > 0 && (
          <Kbd className="ml-auto text-muted-foreground hover:text-accent-foreground bg-white shadow-none">
            <span>Esc</span>
          </Kbd>
        )
      }
      suffixStyling={false}
      {...props}
    />
  );
}
