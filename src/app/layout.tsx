import type { Metadata } from "next";
import { inter, robotoMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eurail Design",
  description: "Eurail design system",
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
