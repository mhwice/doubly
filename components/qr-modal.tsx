"use client";

import { useCallback, useEffect, useState } from "react";
// import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateQRCode } from "@/utils/qr-code";
import { QRCode } from "./qr-code";

interface QRCodeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shortUrl: string;
  code: string;
}

export function QRCodeModal({ isOpen, onOpenChange, shortUrl, code }: QRCodeModalProps) {
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

  // const downloadQRCode = () => {
  //   if (!qrCodeDataUrl) return;
  //   const link = document.createElement("a");
  //   link.href = qrCodeDataUrl;
  //   link.download = `shortlink-${shortCode}.png`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);

  //   // toast.success("QR code downloaded", { description: "The QR code has been downloaded to your device" });
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for your Short URL</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          {isGenerating ? (
            <div className="flex items-center justify-center w-[300px] h-[300px]">
              <div className="size-8 animate-spin rounded-full border-4 border-primary border-t border-t-transparent" />
            </div>
          ) : qrCodeDataUrl ? (
            <div className="flex flex-col items-center space-y-4">
              <QRCode qrCodeDataUrl={qrCodeDataUrl} />
              <p className="text-sm text-center text-muted-foreground">Scan the QR code to open the link in your device's browser.</p>
              <Button onClick={() => {console.log("click")}} className="w-full">
                <Download className="size-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">Failed to generate QR code</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
