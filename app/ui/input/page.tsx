"use client";
import { Input } from "@/components/doubly/ui/input";
import { SearchInput } from "@/components/doubly/ui/search-input";
import { ArrowUpCircleIcon } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [value, setValue] = useState("");

  return (
    <div className="min-h-screen w-full flex justify-center items-center my-20">
      <div className="flex-col space-y-3">
        <h1>Sizes</h1>
        <div className="flex flex-col gap-3">
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
        </div>
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
        <h1>Full Width</h1>
        <div className="flex flex-col gap-5 w-[600px] border border-black">
          <Input placeholder="small, fixed width" size="sm" />
          <Input placeholder="small, full width" size="sm" fullWidth />
          <Input placeholder="medium, fixed width" size="md" />
          <Input placeholder="medium, full width" size="md" fullWidth />
          <Input placeholder="large, fixed width" size="lg" />
          <Input placeholder="large, full width" size="lg" fullWidth />
        </div>
      </div>
    </div>
  );
}
