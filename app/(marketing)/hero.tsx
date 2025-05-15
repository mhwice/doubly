import Link from "next/link"
import { Button } from "./Button"
import { HeroImage } from "./hero-image"
import { Badge } from "@/components/ui/badge"

interface HeroProps {
  isLoggedIn: boolean
}

export function Hero({ isLoggedIn }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="mt-32 flex flex-col items-center justify-center text-center sm:mt-40 container mx-auto px-4 sm:px-6 lg:px-8"
      // className="mt-32 px-20 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center sm:mt-40"
    >
      <Link href="https://github.com/mhwice/doubly"><Badge variant="outline" className="shadow-none mb-5">Proudly Open Source</Badge></Link>
      <h1
        id="hero-title"
        className="inline-block animate-slide-up-fade bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text p-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-7xl dark:from-gray-50 dark:to-gray-300"
        style={{ animationDuration: "700ms" }}
      >
        {/* The database for <br /> modern applications */}
        {/* Shorten, Share, Succeed.<br />Analytics That Make an Impact. */}
        {/* From Clicks to Conversions<br />Every Link Tells a Story */}
        {/* Beyond Short Links<br />A Data-Driven Revolution */}
        Track Every Click<br/>Master Every Metric.
        {/* Link Smarter.<br />Scale Faster. */}
      </h1>
      <p
        className="mt-6 max-w-lg animate-slide-up-fade text-lg text-gray-700 dark:text-gray-400"
        style={{ animationDuration: "900ms" }}
      >
        Doubly is a modern link shortening and tracking service, built for scale and ease-of-use.
      </p>
      <div
        className="mt-8 flex w-full animate-slide-up-fade flex-col justify-center gap-3 px-3 sm:flex-row"
        style={{ animationDuration: "1100ms" }}
      >
        <Button asChild className="h-10 font-semibold hover:cursor-pointer bg-[var(--database)]">
          <Link href={isLoggedIn ? "/dashboard/links" : "/auth/register"}>{isLoggedIn ? "Go to Dashboard" : "Get Started"}</Link>
        </Button>
        <Button
          asChild
          variant="light"
          className="group gap-x-2 bg-transparent font-semibold hover:bg-transparent dark:bg-transparent hover:dark:bg-transparent"
        >
          <Link
            href="https://github.com/mhwice/doubly"
            className="ring-1 ring-gray-200 sm:ring-0 dark:ring-gray-900"
            target="_blank"
          >
            Star on Github
          </Link>
        </Button>
      </div>
      {/* <div
        className="relative mx-auto ml-3 mt-20 h-fit w-[40rem] max-w-6xl animate-slide-up-fade sm:ml-auto sm:w-full sm:px-2"

        style={{ animationDuration: "1400ms" }}
      > */}
        <div
          className="relative mx-auto mt-20 h-fit w-full max-w-6xl sm:px-2 animate-slide-up-fade"
          style={{ animationDuration: "1400ms" }}
        >
        <HeroImage />
        <div
          className="absolute inset-x-0 -bottom-20 -mx-10 max-[400px]:h-4/5 h-2/4 bg-gradient-to-t from-white via-white to-transparent"
          aria-hidden="true"
        />
      </div>

    </section>
  )
}
