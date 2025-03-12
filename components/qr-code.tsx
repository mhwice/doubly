"use client";

import Image from "next/image";

export function QRCode({ qrCodeDataUrl }: { qrCodeDataUrl: string }) {
  return <Image
    src={qrCodeDataUrl}
    alt="qr code"
    width={300}
    height={300}
    className="border rounded-md"
  />
}
