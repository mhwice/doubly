"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

interface ErrorPageProps {
  error?: Error
  reset?: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mb-6" aria-hidden="true" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        We have been made aware of the issue and are actively working towards a fix. Please try again later or return to the homepage.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="defaultFlat" className="min-w-[120px]">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  )
}
