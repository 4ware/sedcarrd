import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sedcarrd — Your work deserves a good frame",
  description: "One considered page for the headshot, reel, credits and people behind your next introduction.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
