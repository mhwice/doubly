"use client";
import { Input } from "@/components/doubly/ui/input";
import { SearchInput } from "@/components/doubly/ui/search-input";
import { ArrowUpCircleIcon } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [value, setValue] = useState("");

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="flex-col space-y-3">
        {/* <h1>Sizes</h1>
        <div className="flex gap-3">
          <Input size="sm" placeholder="Small" />
          <Input size="md" placeholder="Medium" />
          <Input size="lg" placeholder="Large" />
        </div>
        <h1>Prefix & Suffix</h1>
        <div className="flex flex-col gap-3">
          <Input placeholder="Default" prefix={<ArrowUpCircleIcon size="16" className="text-[#8f8f8f]"/>} />
          <Input placeholder="Default" suffix={<ArrowUpCircleIcon size="16" className="text-[#8f8f8f]" />} />
          <Input placeholder="Default" prefix="https://" suffix=".com" />
          <Input placeholder="Default" prefix={<ArrowUpCircleIcon size="16" className="text-[#8f8f8f]" />} suffix={<ArrowUpCircleIcon size="16" className="text-[#8f8f8f]" />} prefixStyling={false} suffixStyling={false} />
          <Input placeholder="Default" prefix="doubly/" />
        </div>
        <h1>Disabled</h1>
        <div className="flex flex-col gap-3">
          <Input disabled placeholder="Disabled with placeholder" />
          <Input disabled defaultValue="Disabled with value" />
          <Input disabled placeholder="Disabled with prefix" prefix={<ArrowUpCircleIcon size="16" className="text-[#8f8f8f]"/>} />
          <Input disabled placeholder="Disabled with suffix" suffix={<ArrowUpCircleIcon size="16" className="text-[#8f8f8f]"/>} />
          <Input disabled placeholder="Disabled with prefix and suffix" prefix={<ArrowUpCircleIcon size="16" className="text-[#8f8f8f]" />} suffix={<ArrowUpCircleIcon size="16" className="text-[#8f8f8f]" />} />
          <Input disabled placeholder="Disabled with prefix and suffix" prefix={<ArrowUpCircleIcon size="16" className="text-[#8f8f8f]" />} suffix={<ArrowUpCircleIcon size="16" className="text-[#8f8f8f]" />} prefixStyling={false} suffixStyling={false} />
        </div> */}
        <h1>Error</h1>
        <div className="flex flex-col gap-5">
          <Input error="Something went wrong" placeholder="long-error@gmail.com"/>
          <Input error="Something went wrong" prefix="https://" placeholder="long-error@gmail.com"/>
          <Input error="Something went wrong" placeholder="long-error@gmail.com" size="lg" />
          <Input error="Error and disabled" disabled placeholder="long-error@gmail.com" />
        </div>
        <h1>Search</h1>
        <div className="flex flex-col gap-5">
          <SearchInput value={value} setValue={setValue} placeholder="Enter some text..." />
          <SearchInput disabled value={value} setValue={setValue} placeholder="Enter some text..." />
          <SearchInput disabled value='spahettah' setValue={setValue} placeholder="Enter some text..." />
          <SearchInput error="bad bad input man" value={value} setValue={setValue} placeholder="Enter some text..." />
        </div>
      </div>
    </div>
  );
}
