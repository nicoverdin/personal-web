import type { Metadata, Viewport } from "next";
import Script from 'next/script';
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nicolás Verdín | Portfolio & Manifesto",
  description: "Software Engineer specializing in AI, Security, and Full-Stack development.",
  openGraph: {
    title: "Nicolás Verdín | Digital Gallery",
    description: "Exploring the intersection of code and minimalist design.",
    url: "https://nicolasverdin.com",
    siteName: "Nicolás Verdín Portfolio",
    images: [
      {
        url: "https://nicolasverdin.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nicolás Verdín Digital Gallery",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicolás Verdín",
    description: "Cybersecurity & AI Engineer",
    creator: "@verdin3c",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="f652f7e1-1d50-4b40-9d8e-ffa9ea030659"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased bg-[#f4f3f0] text-[#1a1a1a] selection:bg-black selection:text-white">
        <Navbar />
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}