"use client";
import { Button } from "@/components/doubly/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch"

export default function Page() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="flex-col space-y-3">
        <h1>Variants</h1>
        <div className="flex gap-3">
          <Button variant="default">Upload</Button>
          <Button variant="outline">Upload</Button>
          <Button variant="destructive">Upload</Button>
          <Button variant="ghost">Upload</Button>
        </div>
        <h1>Sizes</h1>
        <div className="flex gap-3">
          <Button size="sm">Upload</Button>
          <Button size="md">Upload</Button>
          <Button size="lg">Upload</Button>
        </div>
        <h1>Prefix & Suffix</h1>
        <div className="flex gap-3">
          <Button prefix={<ArrowLeft />}>Upload</Button>
          <Button suffix={<ArrowRight />}>Upload</Button>
          <Button prefix={<ArrowLeft />} suffix={<ArrowRight />}>Upload</Button>
        </div>
        <h1>Rounded & Shadow</h1>
        <div className="flex gap-3">
          <Button rounded>Upload</Button>
          <Button shadow>Upload</Button>
          <Button rounded shadow className="">Upload</Button>
        </div>
        <h1>Loading & Disabled</h1>
        <div className="flex gap-3">
          Loading
          <Switch id="loading" checked={isLoading} onCheckedChange={setIsLoading}/>
          Disabled
          <Switch id="disabled" checked={isDisabled} onCheckedChange={setIsDisabled}/>
        </div>
        <div className="flex gap-3">
          <Button loading={isLoading}>loading only</Button>
          <Button disabled={isDisabled}>disabled only</Button>
          <Button disabled={isDisabled} loading={isLoading} rounded variant="default">outline</Button>
          <Button disabled={isDisabled} loading={isLoading} rounded variant="outline">outline</Button>
          <Button disabled={isDisabled} loading={isLoading} rounded variant="ghost">ghost</Button>
          <Button disabled={isDisabled} loading={isLoading} rounded variant="destructive">destructive</Button>
        </div>
      </div>
    </div>
  );
}
