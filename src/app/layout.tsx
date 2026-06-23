import type { Metadata } from "next";
import { inter, robotoMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interrail Brand World",
  description: "Interrail Brand World",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
