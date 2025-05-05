"use client"
import Image from "next/image"

export const GlobalDatabase = () => {

  const features = [
    {
      name: "Advanced Filters",
      description: "Drill down by date, geography, device, or referrer to focus on the metrics that matter most.",
    },
    {
      name: "QR Code Generator",
      description: "Auto-generate QR codes for any Doubly link and track every scan.",
    },
    {
      name: "API Access (soon)",
      description:
        "Programmatically create and track links from your own apps and workflows.",
    },
  ]

  return (
    <div className="px-3">
      <section
        aria-labelledby="global-database-title"
        className=" z-0 relative mx-auto mt-28 flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-3xl bg-gray-950 pt-24 shadow-xl shadow-black/30 md:mt-40"
      >
        {/* <div className="absolute top-0 size-[40rem] rounded-full bg-indigo-800 blur-3xl md:top-[20rem]" /> */}
        <div className="z-10 inline-block rounded-lg border border-indigo-400/20 bg-indigo-800/20 px-3 py-1.5 font-semibold uppercase leading-4 tracking-tight sm:text-sm">
          <span className="bg-gradient-to-b from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            Free with No Limits
          </span>
        </div>
        <h2
          id="global-database-title"
          className="z-10 mt-6 pb-2 inline-block bg-gradient-to-b from-white to-indigo-100 bg-clip-text px-2 text-center text-5xl font-bold tracking-tighter text-transparent md:text-8xl"
        >
          Find your <br /> target audience
          {/* Understand who’s <br />clicking, and how. */}
        </h2>
        <Image
          src="/scaled_map.svg"
          fill
          alt="map"
          className="absolute inset-0 -z-10 object-cover"
        />
        {/* <div className="pointer-events-none absolute inset-0 -z-5 bg-gradient-to-b from-gray-950 via-gray-950/80 to-gray-950" /> */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-5 bg-[radial-gradient(ellipse_at_50%_20%,rgba(14,23,34,1)_10%,rgba(14,23,34,0)_70%)]"
        />

        <div className="z-20 -mt-14 sm:-mt-32 h-[32rem] w-full overflow-hidden md:-mt-36">
          <div className="absolute bottom-0 h-3/5 w-full bg-gradient-to-b from-transparent via-gray-950/95 to-gray-950" />
          <div className="absolute inset-x-6 bottom-12 m-auto max-w-4xl md:top-2/3">
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 rounded-lg border border-white/[3%] bg-white/[1%] px-6 py-6 shadow-xl backdrop-blur md:grid-cols-3 md:p-8">
              {features.map((item) => (
                <div key={item.name} className="flex flex-col gap-2">
                  <h3 className="whitespace-nowrap bg-gradient-to-b from-indigo-300 to-indigo-500 bg-clip-text text-lg font-semibold text-transparent md:text-xl">
                    {item.name}
                  </h3>
                  <p className="text-sm leading-6 text-indigo-200/40">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
