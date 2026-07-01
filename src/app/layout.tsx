import type { Metadata } from "next";

import { inter, lastik } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Purchase",
  description: "Premium stock purchase prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lastik.variable}`}>{children}</body>
    </html>
  );
}
