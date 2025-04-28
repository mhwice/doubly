"use client";

import { useCallback, useEffect, useState } from "react";
// import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateQRCode } from "@/utils/qr-code";
import { QRCode } from "./qr-code";
import { BaseModal } from "./base-modal";

interface QRCodeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shortUrl: string;
}

export function QRCodeModal({ isOpen, onOpenChange, shortUrl }: QRCodeModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const makeQR = useCallback(async () => {
    if (!shortUrl) return;
    setIsGenerating(true);
    const { data: dataUrl, error } = await generateQRCode(shortUrl);
    if (dataUrl) {
      setQrCodeDataUrl(dataUrl);
    }

    setIsGenerating(false);
  }, [shortUrl]);

  useEffect(() => {
    if (isOpen && shortUrl) {
      makeQR();
    }
  }, [isOpen, shortUrl, makeQR]);

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    const code = shortUrl.split("/")[1];
    link.download = `shortlink-${code}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // toast.success("QR code downloaded", { description: "The QR code has been downloaded to your device" });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="QR Code for your Short URL"
      submitLabel="Download QR Code"
      description="Scan the QR code to open the link in your device's browser."
      submitIcon={<Download className="size-4" />}
      onSubmit={downloadQRCode}
    >
      <div className="flex flex-col items-center justify-center p-4">
        {isGenerating ? (
          <div className="flex items-center justify-center w-[300px] h-[300px]">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t border-t-transparent" />
          </div>
        ) : qrCodeDataUrl ? (
          <QRCode qrCodeDataUrl={qrCodeDataUrl} />
        ) : (
          <div className="text-center text-muted-foreground">Failed to generate QR code</div>
        )}
      </div>
    </BaseModal>
  );
}
