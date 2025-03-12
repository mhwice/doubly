import { generateQRCode } from "@/utils/qr-code";
import { InputForm } from "./url-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { QRCode } from "@/components/qr-code";

export default async function Page() {

  const shortLink = "http://localhost:3000/GFUW17?source=qr";
  const { data: url, error } = await generateQRCode(shortLink);
  if (!url) throw new Error();

  return <QRCode qrCodeDataUrl={url} />

  // const session = await auth.api.getSession({
  //   headers: await headers()
  // });

  // if (!session?.user) redirect("/");

  // return (
  //   <InputForm userId={session.user.id} />
  // );
}
