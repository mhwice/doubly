"use client";

import { Button } from "./button";
import Link from "next/link";

interface ButtonLinksProps {
  label: string;
  href: string;
}

export function ButtonLink({ label, href }: ButtonLinksProps) {
  return (
    <Button variant="ghost" asChild>
      <Link href={href} legacyBehavior>
        <a>{label}</a>
      </Link>
    </Button>
  );
}
