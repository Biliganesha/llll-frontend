import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ApolloWrapper } from "@/lib/ApolloWrapper";
import { NavBarWrapper } from "@/components/ui/NavBarWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Link! Like! Library! Legacy! — 蓮の空アーカイブ",
  description:
    "Link! Like! Library! Legacy! — Arsip non-profit fan-made untuk story Love Live! Hasu no Sora (蓮の空). Melestarikan kenangan dari Link! Like! Love Live! (リンクラ) sebelum 30 Juni 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ApolloWrapper>
          <NavBarWrapper />
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}
