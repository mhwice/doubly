import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home } from "lucide-react"
// import ErrorScene from "@/app/(marketing)/error/error-scene"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mb-6" aria-hidden="true" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">This page doesn't exist!</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Please check the URL you are visiting, or return to the homepage.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="defaultFlat" className="min-w-[120px]">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  )
}
