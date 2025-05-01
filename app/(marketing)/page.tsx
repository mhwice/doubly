import { getSession } from "@/lib/get-session";
import { Hero } from "./hero";
import UrlShortenerDemo from "./url-shorener";
import { Features } from "./features";
import ABTestingExample from "./ab-test";
import { VerticalTimeline } from "./vertical-timeline";
// import Skew from "./skew";
// import HeroSection from "./skew-full";
import { GlobalDatabase } from "../landing/components/ui/GlobalDatabase";
import Image from "next/image";
import HowItWorksSection from "./how-it-works";
import { CallToAction } from "./cta";
import { Footer } from "./dashboard-footer";
import { WorldMap } from "./dotted-map";
// import { GlobeDemo } from "./globe-demo";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="flex flex-col overflow-hidden items-center">
      <Hero isLoggedIn={!!session?.user} />
      <HowItWorksSection />

      <div className="w-full"><GlobalDatabase /></div>
      {/* <div
          className="h-[300px] w-[300px] animate-pulse rounded-full bg-gradient-to-br from-[var(--database)] via-[var(--database-secondary)] to-indigo-500 opacity-70 blur-3xl"
          aria-hidden="true"
        /> */}
      {/* <div className="w-full"> */}
      {/* <Image
        src="/scaled_map.svg"
        width={700}
        height={300}
        alt="map"
        // className=""
      /> */}
      {/* </div> */}
      {/* <div className="w-[500px] h-[500px]">
        <WorldMap
        dots={[
          {
            start: {
              lat: 64.2008,
              lng: -149.4937,
            }, // Alaska (Fairbanks)
            end: {
              lat: 34.0522,
              lng: -118.2437,
            }, // Los Angeles
          },
          {
            start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
            end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
          },
          {
            start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
            end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
          },
          {
            start: { lat: 51.5074, lng: -0.1278 }, // London
            end: { lat: 28.6139, lng: 77.209 }, // New Delhi
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
          },
        ]}
      />
      </div> */}
      {/* <GlobeDemo /> */}
      <CallToAction isLoggedIn={!!session?.user} />

    </main>
  )
}

/*

1. Title, catchy "this is what we do in one sentence"



2. How it works - explain how they use the app

  1. You provide us with the url to any website.
  2. Our system generates a new link that acts as a proxy to the url you provided.
  3. You share the proxy link.
  4. Whenever someone clicks on the proxy link, we record detailed time, geographic, and device data on the person who clicked the link.
  5. We present this data to in an easy-to-use interface.
  6. You can make better business decisions by understanding which links outperform, and who your audience is.


3. Analytics - explain what we can tell them - use screenshot of app
4. Call to action - say hey, sign up and use the app, or view this demo account



*/
