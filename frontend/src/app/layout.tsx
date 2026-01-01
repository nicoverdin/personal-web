import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Mi Web Personal",
  description: "Portafolio y Blog creado con Next.js y NestJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50">
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}