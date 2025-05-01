import { Clock, Globe, Smartphone } from "lucide-react";
import Image from "next/image";

export function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our URL shortener offers more than just shorter links. Discover the tools that help you understand
                  your audience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Image
                src="/placeholder.svg?height=400&width=600"
                width={600}
                height={400}
                alt="Dashboard analytics showing click data"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Real-time Tracking</h3>
                      <p className="text-muted-foreground">
                        Monitor clicks as they happen with timestamps for each interaction.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Geographic Data</h3>
                      <p className="text-muted-foreground">
                        See where your audience is located with detailed location information.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Device Analytics</h3>
                      <p className="text-muted-foreground">
                        Understand which devices your audience uses to access your content.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

  )
}
