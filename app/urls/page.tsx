import { InputForm } from "./url-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import QRCode from "qrcode";

const qrCodeOptions = {
  width: 300,
  margin: 2,
  color: {
    dark: "#000000",
    light: "#ffffff",
  }
}

async function makeQRCode(url: string) {
  const dataUrl = await QRCode.toDataURL(url, qrCodeOptions);
  return dataUrl;
}

export default async function Page() {

  const shortLink = "http://localhost:3000/GFUW17?source=qr";
  const url = await makeQRCode(shortLink);

  return (
    <Image
      src={url}
      alt="qr"
      width={300}
      height={300}
      className="border rounded-md"
      unoptimized
    />
  );

  // const session = await auth.api.getSession({
  //   headers: await headers()
  // });

  // if (!session?.user) redirect("/");

  // return (
  //   <InputForm userId={session.user.id} />
  // );
}
