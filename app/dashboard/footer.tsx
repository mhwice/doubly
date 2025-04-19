import Link from "next/link"
import { DatabaseLogo } from "../(marketing)/DatabaseLogo"

export function Footer() {
  return (
    <footer id="footer" className="border-t">
      <div className="mx-[15%] p-5">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <DatabaseLogo className="w-28" />
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Docs</Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Guides</Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">FAQs</Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Help</Link>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm leading-5 text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Database, Inc. All rights
              reserved.
            </p>
            <div className="rounded-full border border-gray-200 py-1 pl-1 pr-2 dark:border-gray-800">
              <div className="flex items-center gap-1.5">
                <div className="relative size-4 shrink-0">
                  <div className="absolute inset-[1px] rounded-full bg-emerald-500/20 dark:bg-emerald-600/20" />
                  <div className="absolute inset-1 rounded-full bg-emerald-600 dark:bg-emerald-500" />
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-50">
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
