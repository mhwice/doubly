import Link from "next/link";
import { Button } from "./Button";
import { Button as ShadButton } from "@/components/ui/button";

interface CTAProps {
  isLoggedIn: boolean;
}

export function CallToAction({ isLoggedIn }: CTAProps) {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Ready to get started?
          </h2>
          <p className="mt-4">Create your account and have your links start working Doubly.<br/>Need more convincing? Explore the app using a demo account.</p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button className="h-10 font-semibold hover:cursor-pointer">
              <Link href={isLoggedIn ? "/dashboard/links" : "/auth/login"}>
                {isLoggedIn ? "Go to Dashboard" : "Create account"}
              </Link>
            </Button>

              <ShadButton variant="flat" className="h-10 font-semibold hover:cursor-pointer">
                <Link href="/">
                  Explore
                </Link>
              </ShadButton>
          </div>
        </div>
      </div>
    </section>
  );
}
