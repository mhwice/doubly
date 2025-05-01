import React from "react"
import { Badge } from "../landing/components/Badge"
import { VerticalTimeline } from "./vertical-timeline"

const stats = [
  {
    name: "Bandwith increase",
    value: "+162%",
  },
  {
    name: "Better storage efficiency",
    value: "2-3x",
  },
  {
    name: "Rows ingested / second",
    value: "Up to 9M",
  },
]

export default function HowItWorksSection() {
  return (
    <section
      aria-labelledby="features-title"
      className="mx-auto mt-44 w-full px-3"
    >
      <div className="flex flex-col w-full items-center mb-5">

        <Badge>How it works</Badge>
        <h2
          id="features-title"
          className="mt-3 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300 text-center"
        >
          Effortless link creation. Actionable analytics.
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400 text-center">
          {/* Doubly&rsquo; links are designed to be a seamless stand-in for links <br/>you currently use, so switching takes seconds. */}
          Switch over in seconds — Doubly links slot right into your existing tweets, emails, or campaigns with zero downtime.
        </p>
      </div>
      <VerticalTimeline />
    </section>
  )
}
