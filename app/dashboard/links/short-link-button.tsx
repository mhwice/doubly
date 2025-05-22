"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { IoCopyOutline } from "react-icons/io5"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CopyButtonProps {
  textToCopy: string
  className?: string
}

export default function CopyButton({ textToCopy, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={className}
            onClick={copyToClipboard}
            aria-label="Copy to clipboard"
          >
            {copied ? <Check className="h-2 w-2" /> : <IoCopyOutline className="h-2 w-2" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
