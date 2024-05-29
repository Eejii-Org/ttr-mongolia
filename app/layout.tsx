import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";

// const defaultUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ttrmongolia.com"),
  title: "TTR Mongolia",
  description: "We offer unforgettable travel in Mongolia",
  icons: ["/favicon.ico"],
  keywords: [
    "Mongolia travel",
    "Mongolia travel agency",
    "Mongolia adventure travel",
    "Mongolia tours",
    "Mongolia trip",
    "Mongolia vacation",
    "Mongolia holiday",
    "Visit Mongolia",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <GoogleTagManager gtmId="AW-16573753978" />
      <body className="bg-background text-foreground gip">
        <NextTopLoader showSpinner={false} color="#fda403" />
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
      </body>
      <Analytics />
    </html>
  );
}
