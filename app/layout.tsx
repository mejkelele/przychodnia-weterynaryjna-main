import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "System Przychodni Weterynaryjnej",
  description: "Zarządzanie wizytami i pacjentami",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}
      >
        <Navbar />

        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="bg-white border-t py-4 text-center text-sm text-gray-500 mt-auto">
          © 2025 HP KF MP TD
        </footer>
      </body>
    </html>
  );
}
