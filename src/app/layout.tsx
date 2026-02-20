import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { LanguageProvider } from "@/components/LanguageProvider";
import { FooterInner } from "@/components/FooterInner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrackBase - Personal Tracker",
  description: "Your personal diet, workout, and shopping tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col`}
      >
        <LanguageProvider>
          <Navigation />
          <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
            {children}
          </main>
          <FooterInner year={year} />
        </LanguageProvider>
      </body>
    </html>
  );
}
