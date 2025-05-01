"use client"

import useScroll from "./lib/use-scroll"
import { cx } from "./lib/utils"
import { RiCloseLine, RiMenuLine } from "@remixicon/react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { DatabaseLogo } from "./DatabaseLogo"
import { Button } from "./Button"
import { useRouter } from 'next/navigation';
import Image from "next/image"

interface NavbarProps {
  isLoggedIn: boolean
}

export function Navbar({ isLoggedIn }: NavbarProps) {
  const scrolled = useScroll(15)
  const [open, setOpen] = useState(false)
  const router = useRouter();

  useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia("(min-width: 768px)")
    const handleMediaQueryChange = () => {
      setOpen(false)
    }

    mediaQuery.addEventListener("change", handleMediaQueryChange)
    handleMediaQueryChange()

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange)
    }
  }, [])

  const handleOnSignInClicked = () => {
    // console.log("sign in");
    if (isLoggedIn) {
      router.push("/dashboard/links");
    } else {
      router.push("/auth/login");
    }
  }

  return (
    <header className={cx(
      "fixed inset-x-3 top-4 z-50 mx-auto flex max-w-6xl transform-gpu animate-slide-down-fade justify-center overflow-hidden rounded-xl border border-transparent px-3 py-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform",
      open === true ? "h-52" : "h-16",
      scrolled || open === true
        ? "backdrop-blur-nav max-w-3xl border-gray-100 bg-white/80 shadow-xl shadow-black/5 dark:border-white/15 dark:bg-black/70"
        : "bg-white/0 dark:bg-gray-950/0",
    )}>
      <div className="w-full md:my-auto">
        <div className="relative flex items-center justify-between">
          <Link href="/" aria-label="Home">
            <span className="sr-only">Company logo</span>
            {/* <DatabaseLogo className="w-28 md:w-32" /> */}
            <Image
              src="/logo-with-text.svg"
              alt="logo"
              width="100"
              height="100"
              priority />

          </Link>
          <nav className="hidden md:absolute md:left-1/2 md:top-1/2 md:block md:-translate-x-1/2 md:-translate-y-1/2 md:transform">
            <div className="flex items-center gap-10 font-medium">
              <Link className="px-2 py-1 text-gray-900 dark:text-gray-50" href="">Solutions</Link>
              <Link className="px-2 py-1 text-gray-900 dark:text-gray-50" href="/learn-more">Resources</Link>
              <Link className="px-2 py-1 text-gray-900 dark:text-gray-50" href="">Changelog</Link>
            </div>
          </nav>
          <Button onClick={handleOnSignInClicked} className="hidden h-10 font-semibold md:flex">{isLoggedIn ? "Dashboard" : "Sign In"}</Button>
          <div className="flex gap-x-2 md:hidden">
            <Button onClick={handleOnSignInClicked}>{isLoggedIn ? "Dashboard" : "Sign In"}</Button>
            <Button onClick={() => setOpen(!open)} variant="light" className="aspect-square p-2">
              {open ? (<RiCloseLine aria-hidden="true" className="size-5" />) : (<RiMenuLine aria-hidden="true" className="size-5" />)}
            </Button>
          </div>
        </div>
        <nav className={cx("my-6 flex text-lg ease-in-out will-change-transform md:hidden", open ? "" : "hidden",)}>
          <ul className="space-y-4 font-medium">
            <li onClick={() => setOpen(false)}>
              <Link href="">Solutions</Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href="/learn-more">Resources</Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href="">Changelog</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
