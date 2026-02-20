import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="w-full max-w-5xl mx-auto px-4 py-6 flex-1">
          {children}
        </main>
        <footer className="border-t border-gray-200 bg-white">
          <div className="w-full max-w-5xl mx-auto px-4 py-4 text-sm text-gray-500 flex items-center justify-between">
            <span>© {year} TrackBase</span>
            <span>v0.1.0</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
