import { getSession } from "@/lib/get-session";
import { Hero } from "./hero";
import UrlShortenerDemo from "./url-shorener";
import { Features } from "./features";
import ABTestingExample from "./ab-test";
import { VerticalTimeline } from "./vertical-timeline";
import Skew from "./skew";
import HeroSection from "./skew-full";
import { GlobalDatabase } from "../landing/components/ui/GlobalDatabase";
import Image from "next/image";
import HowItWorksSection from "./how-it-works";
import { CallToAction } from "./cta";
import { Footer } from "./dashboard-footer";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="flex flex-col overflow-hidden items-center">
      <Hero isLoggedIn={!!session?.user} />
      <HowItWorksSection />
      <div className="w-full">
        <GlobalDatabase />
      </div>
      <CallToAction isLoggedIn={!!session?.user} />
      {/* <Footer /> */}

      {/* <div className="w-full"><GlobalDatabase /></div> */}

      {/* <div className="h-150 shrink-0 overflow-hidden [mask-image:radial-gradient(white_30%,transparent_90%)] perspective-[4000px] perspective-origin-center">
        <div className="-translate-y-10 -translate-z-10 rotate-x-10 rotate-y-20 -rotate-z-10 transform-3d">
          <Image
            className="rounded-(--radius) z-1 relative border dark:hidden"
            src="/analytics.png"
            alt="Tailark hero section"
            width={2880}
            height={2074}
          />
        </div>
      </div> */}
      {/* <Skew />
      <HeroSection /> */}
      {/* <div className="my-14"></div>
      <UrlShortenerDemo />
      <Features />
      <ABTestingExample /> */}
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
