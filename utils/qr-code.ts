/**
 *
 * The purpose of this file is to handle every related to qr codes.
 * Any other file should just display images, but this file should do all the generation
 * and interaction with the qr library.
 *
 */

import QRCode from "qrcode";

const qrCodeOptions = {
  width: 300,
  margin: 2,
  color: {
    dark: "#000000",
    light: "#ffffff",
  }
};

export async function generateQRCode(url: string) {
  try {
    const dataUrl = await QRCode.toDataURL(url, qrCodeOptions);
    return { data: dataUrl };
  } catch (error: unknown) {
    return { error: "Failed to generate QR Code" };
  }
}

