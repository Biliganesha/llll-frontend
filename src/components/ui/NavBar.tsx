"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage, useTr } from "@/lib/language";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { DockMembersButton } from "@/components/ui/DockMembersButton";

/** Nama section untuk island pill kontekstual (padanan NAME pill status bar app). */
function sectionOf(pathname: string): { jp: string; id: string } {
  if (pathname.startsWith("/katsudou-kiroku")) return { jp: "活動記録", id: "Catatan Aktivitas" };
  if (pathname.startsWith("/sukukone")) return { jp: "スクコネ", id: "SukuKone" };
  if (pathname.startsWith("/calendar")) return { jp: "カレンダー", id: "Kalender" };
  if (
    ["/characters", "/units", "/seiyuu", "/relationships"].some((p) => pathname.startsWith(p))
  )
    return { jp: "メンバー", id: "Anggota" };
  if (pathname.startsWith("/collection")) return { jp: "コレクション", id: "Koleksi" };
  if (pathname.startsWith("/timeline")) return { jp: "タイムライン", id: "Garis Waktu" };
  if (pathname.startsWith("/gameplay")) return { jp: "ゲームプレイ", id: "Gameplay" };
  if (pathname.startsWith("/search")) return { jp: "検索", id: "Cari" };
  if (pathname.startsWith("/about")) return { jp: "このサイトについて", id: "Tentang" };
  return { jp: "蓮ノ空アーカイブ", id: "Arsip Hasunosora" };
}

/**
 * NavBar — OS chrome halaman-dalam tablet/desktop (doktrin: desktop-OS, BUKAN
 * navbar web klasik). Top bar meniru status bar home: brand + island kontekstual
 * + tanggal + jam realtime; navigasi via dock bawah + Menu Launcher — konsisten
 * dengan Home (DesktopHome/TabletHome).
 */
export function NavBar() {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const tr = useTr();
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      );
      setDate(
        `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, "0")}.${now
          .getDate()
          .toString()
          .padStart(2, "0")}`
      );
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const sec = sectionOf(pathname);

  return (
    <>
      {/* Top bar ala status bar OS */}
      <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-white/60 select-none">
        <div className="px-4 lg:px-6 flex items-center h-11 gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="メニュー"
            title="メニュー"
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--icon-line)] hover:bg-white active:scale-90 transition cursor-pointer"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </button>

          <Link href="/" className="shrink-0 flex items-center gap-2">
            <span className="text-sm font-extrabold brand-gradient-text tracking-wide leading-none">
              L!L!L!L!
            </span>
          </Link>

          <div className="flex-1" />

          <button
            onClick={() => setLang(lang === "jp" ? "id" : "jp")}
            className="shrink-0 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:bg-white active:scale-95 transition cursor-pointer shadow-sm"
            aria-label="言語切替 / Ganti bahasa"
          >
            {lang === "jp" ? "JP" : "ID"}
          </button>

          <div className="shrink-0 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#b3d4ff] via-[#c9b3ff] to-[#ffb3d9] px-3 py-1 shadow-sm">
            <span className="text-[11px]" aria-hidden>🌸</span>
            <span className="text-[11px] font-semibold text-slate-800 max-w-[180px] truncate">
              {tr(sec.jp, sec.id)}
            </span>
          </div>

          <div className="shrink-0 tabular-nums text-[11px] font-medium text-slate-600">{date}</div>
          <div className="shrink-0 tabular-nums text-sm font-bold text-slate-800">
            {time || "--:--"}
          </div>
        </div>
      </nav>

      {/* Dock bawah (konsisten dgn home OS) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-xl">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="メニュー"
            className="group relative flex items-center justify-center w-10 h-10 rounded-xl brand-gradient-bg text-white shadow-md hover:shadow-lg active:scale-90 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
            <DockTip label={tr("メニュー", "Menu")} />
          </button>
          <div className="w-px h-8 bg-[var(--linkura-border)]" />
          <DockLink href="/sukukone" active={pathname.startsWith("/sukukone")} label="スクコネ" emoji="🎤" gradient="linear-gradient(135deg, #6a7bff 0%, #a88dff 100%)" />
          <DockLink href="/katsudou-kiroku" active={pathname.startsWith("/katsudou-kiroku")} label="活動記録" emoji="📖" gradient="linear-gradient(135deg, #ffb3d9 0%, #b3d4ff 100%)" />
          <DockLink href="/calendar" active={pathname.startsWith("/calendar")} label="カレンダー" emoji="📅" gradient="linear-gradient(135deg, #9ee6ff 0%, #a5aeff 100%)" />
          <DockMembersButton size="sm" />
          <DockLink href="/search" active={pathname.startsWith("/search")} label="検索" emoji="🔍" gradient="linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)" />
        </div>
      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function DockTip({ label }: { label: string }) {
  return (
    <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-800 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
      {label}
    </span>
  );
}

function DockLink({
  href,
  label,
  emoji,
  gradient,
  active,
}: {
  href: string;
  label: string;
  emoji: string;
  gradient: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center justify-center w-10 h-10 rounded-xl shadow-md hover:shadow-lg active:scale-90 hover:-translate-y-0.5 transition text-lg ${
        active ? "ring-2 ring-white" : ""
      }`}
      style={{ background: gradient }}
      aria-label={label}
    >
      <span aria-hidden>{emoji}</span>
      {active && (
        <span aria-hidden className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-slate-500" />
      )}
      <DockTip label={label} />
    </Link>
  );
}
