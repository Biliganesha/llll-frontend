"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { NotificationBar } from "@/components/ui/NotificationBar";
import { useTr } from "@/lib/language";

type Props = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

const DAY_EN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

/**
 * Phone layout — home ala app リンクラ (acuan s02_afterlogin.png): wallpaper asli
 * bersih tanpa teks besar, jam 2 baris + tanggal di kanan-atas wallpaper, ikon
 * bulat gear (About) + 初心者マーク (buka ulang panduan/disclaimer) kiri-atas.
 * Branding tampil lewat FirstVisitModal (keputusan poin 17) & halaman About.
 */
export function PhoneHome({ menuOpen, setMenuOpen }: Props) {
  const router = useRouter();
  const tr = useTr();
  const [clock, setClock] = useState<{ hh: string; mm: string; date: string } | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock({
        hh: now.getHours().toString().padStart(2, "0"),
        mm: now.getMinutes().toString().padStart(2, "0"),
        date: `${(now.getMonth() + 1).toString().padStart(2, "0")}/${now
          .getDate()
          .toString()
          .padStart(2, "0")}  ${DAY_EN[now.getDay()]}`,
      });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative flex-1 flex flex-col min-h-screen wallpaper-default overflow-hidden">
      <StatusBar episodeCount={0} unitLabel={tr("アーカイブ", "Arsip")} />

      <NotificationBar />

      <main className="relative flex-1">
        {/* Ikon bulat kiri-atas: gear → About, 初心者マーク → buka ulang panduan */}
        <div className="absolute left-4 top-6 flex gap-3">
          <Link
            href="/about"
            aria-label={tr("このサイトについて", "Tentang situs ini")}
            className="w-11 h-11 rounded-full bg-white/95 shadow-md flex items-center justify-center active:scale-90 transition"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--icon-line)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3.2" />
              <path d="M19.4 15a1.6 1.6 0 0 0 .32 1.77l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-1 1.47V21a2 2 0 1 1-4 0v-.09a1.6 1.6 0 0 0-1-1.47 1.6 1.6 0 0 0-1.77.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.6 1.6 0 0 0 .32-1.77 1.6 1.6 0 0 0-1.47-1H3a2 2 0 1 1 0-4h.09a1.6 1.6 0 0 0 1.47-1 1.6 1.6 0 0 0-.32-1.77l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.6 1.6 0 0 0 1.77.32h.01a1.6 1.6 0 0 0 1-1.47V3a2 2 0 1 1 4 0v.09a1.6 1.6 0 0 0 1 1.47 1.6 1.6 0 0 0 1.77-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.6 1.6 0 0 0-.32 1.77v.01a1.6 1.6 0 0 0 1.47 1H21a2 2 0 1 1 0 4h-.09a1.6 1.6 0 0 0-1.47 1z" />
            </svg>
          </Link>
          <button
            onClick={() => window.dispatchEvent(new Event("llll:show-guide"))}
            aria-label={tr("ガイドを見る", "Lihat panduan")}
            className="w-11 h-11 rounded-full bg-white/95 shadow-md flex items-center justify-center active:scale-90 transition"
          >
            {/* 初心者マーク (wakaba) sederhana */}
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2 4 6v7c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-4z" fill="none" stroke="var(--icon-line)" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M12 4.4 6.2 7.3v5.5c0 3.4 2.5 6.1 5.8 7V4.4z" fill="#7db8f2" />
              <path d="M12 4.4v15.4c3.3-.9 5.8-3.6 5.8-7V7.3L12 4.4z" fill="#f5d76e" />
            </svg>
          </button>
        </div>

        {/* Jam besar + tanggal di wallpaper (kanan, sepertiga atas) */}
        {clock && (
          <div className="absolute right-6 top-[16%] text-right home-clock" aria-hidden>
            <div className="text-[84px] font-light">{clock.hh}</div>
            <div className="text-[84px] font-light">{clock.mm}</div>
            <div className="text-[15px] font-medium tracking-[0.2em] mt-2">{clock.date}</div>
          </div>
        )}
      </main>

      <p className="relative text-center text-[8px] text-white/85 drop-shadow pb-1">
        Fan-made non-profit · © Bandai Namco / ODD No.
      </p>

      <BottomNav
        onMenu={() => setMenuOpen(!menuOpen)}
        onHome={() => router.push("/")}
        hasNotif
        menuOpen={menuOpen}
      />

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
