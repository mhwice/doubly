import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer id="footer" className="border-t border-vborder">
      {/* <div className="mx-[15%] p-5"> */}
      <div className="max-w-7xl mx-auto px-3 md:px-5 xl:px-10 py-5">
      <div className="flex flex-col gap-4 items-center sm:items-stretch">
          <div className="flex gap-4 items-center">
            {/* <DatabaseLogo className="w-28" /> */}
            <Image
              src="/logo-with-text.svg"
              alt="logo"
              width="80"
              height="80"
              priority />
            <Link href="/" className="text-sm text-vsecondary hover:text-foreground">Home</Link>
            <Link href="/dashboard/settings" className="text-sm text-vsecondary hover:text-vprimary">Settings</Link>
            {/* <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Guides</Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">FAQs</Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Help</Link> */}
          </div>
          <div className="flex flex-col items-center justify-between sm:flex-row gap-3">
            <p className="text-xs leading-5 text-vtertiary">
              &copy; {new Date().getFullYear()} Database, Inc. All rights
              reserved.
            </p>
            <div className="rounded-full border border-vborder py-1 pl-1 pr-2">
              <div className="flex items-center gap-1.5">
                <div className="relative size-4 shrink-0">
                  <div className="absolute inset-[1px] rounded-full bg-emerald-500/20" />
                  <div className="absolute inset-1 rounded-full bg-emerald-600" />
                </div>
                <span className="text-xs text-vsecondary">
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
