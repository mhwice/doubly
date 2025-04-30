"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Copy, LinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function UrlShortenerDemo() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setShortUrl("https://short.link/a1b2c3")
      setIsLoading(false)
    }, 1000)
  }

  const handleCopy = () => {
    if (!shortUrl) return
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-primary" />
          URL Shortener
        </CardTitle>
        <CardDescription>Enter a long URL to create a shortened, trackable link</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="https://example.com/very/long/url/that/needs/shortening"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Shortening..." : "Shorten URL"}
          </Button>
        </form>

        {shortUrl && (
          <div className="mt-4 space-y-2 rounded-md border p-3">
            <div className="text-sm font-medium text-muted-foreground">Your shortened URL:</div>
            <div className="flex items-center gap-2">
              <Input value={shortUrl} readOnly className="bg-muted/50 font-medium" />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                className={cn("flex-shrink-0", copied && "border-green-500 text-green-500")}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start text-xs text-muted-foreground">
        <p>When someone clicks your link, we collect:</p>
        <ul className="mt-1 list-disc pl-4">
          <li>Time of click</li>
          <li>Geographic location</li>
          <li>Device information</li>
        </ul>
      </CardFooter>
    </Card>
  )
}
