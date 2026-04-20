import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ApolloWrapper } from "@/lib/ApolloWrapper";
import { LanguageProvider } from "@/lib/language";
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

const siteUrl = "https://llll-frontend.vercel.app";
const siteName = "LLLL — 蓮の空アーカイブ";
const siteDescription =
  "Link! Like! Library! Legacy! — Arsip non-profit fan-made untuk story Love Live! Hasu no Sora (蓮の空). Melestarikan kenangan dari Link! Like! Love Live! (リンクラ) sebelum 30 Juni 2026.";

export const metadata: Metadata = {
  title: {
    default: "Link! Like! Library! Legacy! — 蓮の空アーカイブ",
    template: "%s | LLLL",
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName,
    title: "Link! Like! Library! Legacy!",
    description: siteDescription,
    url: siteUrl,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  icons: {
    icon: "/favicon.ico",
  },
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
        <LanguageProvider>
          <ApolloWrapper>
            <NavBarWrapper />
            {children}
          </ApolloWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
