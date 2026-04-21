import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import MatrixBackground from "@/components/MatrixBackground";
import SiteHeader from "@/components/SiteHeader";

import MatrixSanitizer from "@/components/MatrixSanitizer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wecode // Terminal",
  description:
    "Master AI & ML through code. Hack research papers, solve algorithmic challenges, and build real-world implementations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-gray-300">
        <MatrixSanitizer />
        <MatrixBackground />
        <div className="scanline-overlay" aria-hidden />
        <SiteHeader />
        <main className="relative z-10 flex min-h-[calc(100vh-80px)] flex-1 flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
