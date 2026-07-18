"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";

/**
 * CollectionShell — kerangka 3-layout halaman コレクション (pola sama dgn page
 * lain: phone = StatusBar+BottomNav+MenuOverlay; tablet/desktop = konten polos,
 * OS chrome datang dari NavBarWrapper). Band header ala app (s04/s05).
 */
export function CollectionShell({
  bandTitle,
  counter = 0,
  children,
}: {
  bandTitle: string;
  counter?: number;
  children: ReactNode;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const band = (
    <div className="feature-band-katsudou px-4 py-2.5 shadow-sm">
      <h1 className="text-base font-bold text-white drop-shadow tracking-wide">{bandTitle}</h1>
    </div>
  );

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={counter} unitLabel="コレクション" />
        {band}
        <main className="flex-1 px-3 pt-3 pb-20 overflow-y-auto">{children}</main>
        <BottomNav
          onBack={() => router.back()}
          onMenu={() => setMenuOpen(!menuOpen)}
          onHome={() => router.push("/")}
          menuOpen={menuOpen}
        />
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      {/* ===== TABLET ===== */}
      <div className="hidden sm:flex lg:hidden flex-1 flex-col min-h-screen bg-background">
        {band}
        <main className="flex-1 px-6 py-4 max-w-3xl mx-auto w-full pb-24">{children}</main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        {band}
        <main className="max-w-5xl mx-auto w-full px-8 py-5 flex-1 pb-24">{children}</main>
      </div>
    </>
  );
}
