import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nicolás Verdín Domínguez",
  description: "Creado con Next.js y NestJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          async
          defer src="https://cloud.umami.is/script.js"
          data-website-id="f652f7e1-1d50-4b40-9d8e-ffa9ea030659"
        />
      </head>
      <body className="antialiased bg-gray-50">
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}