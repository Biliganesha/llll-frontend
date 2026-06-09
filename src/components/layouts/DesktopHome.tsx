"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { NostalgiaWidget } from "@/components/calendar/NostalgiaWidget";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useTr, useLanguage } from "@/lib/language";

/**
 * DesktopHome — paradigma desktop OS (bukan website klasik).
 * Layout: wallpaper full + top-right status bar + widget 今日の蓮ノ空 pinned
 *         + bottom-center dock dengan menu button (seperti Start button / macOS Dock).
 * Klik menu: Menu Launcher terpadu (MenuOverlay).
 */
export function DesktopHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const tr = useTr();

  return (
    <div className="relative flex-1 min-h-screen wallpaper-default overflow-hidden">
      <DesktopStatusBar />

      <main className="relative h-full min-h-screen flex items-center justify-center">
        <div className="text-center pointer-events-none select-none">
          <h1 className="text-7xl font-extrabold brand-gradient-text leading-[1.1] drop-shadow-sm">
            Link! Like!
            <br />
            Library! Legacy!
          </h1>
          <p className="text-base text-[var(--linkura-text-dim)] mt-4 tracking-[0.2em] font-medium">
            {tr("蓮ノ空アーカイブ", "Arsip 蓮ノ空")}
          </p>
          <p className="text-xs text-[var(--linkura-text-dim)]/70 mt-2">
            {tr(
              "Link! Like! Love Live! 蓮ノ空の活動を永続保存",
              "Link! Like! Love Live! — Mengabadikan aktivitas 蓮ノ空"
            )}
          </p>
        </div>
      </main>

      <DesktopWidget />

      <DesktopDock onMenuClick={() => setMenuOpen(true)} />

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

function DesktopStatusBar() {
  const tr = useTr();
  const { lang, setLang } = useLanguage();
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hh = now.getHours().toString().padStart(2, "0");
      const mm = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hh}:${mm}`);

      const y = now.getFullYear();
      const mo = (now.getMonth() + 1).toString().padStart(2, "0");
      const d = now.getDate().toString().padStart(2, "0");
      setDate(`${y}.${mo}.${d}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 py-2.5 bg-white/60 backdrop-blur-md border-b border-white/50 select-none">
      <div className="flex items-center gap-2">
        <span className="text-sm font-extrabold brand-gradient-text tracking-wide">
          L!L!L!L!
        </span>
        <span className="text-[10px] text-[var(--linkura-text-dim)] hidden xl:inline">
          Link! Like! Library! Legacy!
        </span>
      </div>

      <div className="flex items-center gap-3 text-slate-700">
        <button
          onClick={() => setLang(lang === "jp" ? "id" : "jp")}
          className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-white active:scale-95 transition cursor-pointer shadow-sm"
          aria-label="言語切替 / Ganti bahasa"
        >
          {lang === "jp" ? "JP" : "ID"}
        </button>
        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#b3d4ff] via-[#c9b3ff] to-[#ffb3d9] px-3 py-1 shadow-sm">
          <span className="text-xs" aria-hidden>🌸</span>
          <span className="text-[11px] font-semibold text-slate-800">
            {tr("蓮ノ空アーカイブ", "Arsip 蓮ノ空")}
          </span>
        </div>
        <div className="tabular-nums text-[11px] font-medium text-slate-700">
          {date}
        </div>
        <div className="tabular-nums text-sm font-bold text-slate-800">
          {time || "--:--"}
        </div>
      </div>
    </div>
  );
}

function DesktopWidget() {
  const tr = useTr();
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="absolute top-20 right-6 z-10 w-[340px] cursor-grab active:cursor-grabbing"
    >
      <div className="rounded-3xl bg-white/92 backdrop-blur-xl shadow-2xl border border-white/80 overflow-hidden">
        <div className="brand-gradient-bg px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-bold text-white drop-shadow">
            📌 {tr("ピン留めウィジェット", "Widget Tersemat")}
          </span>
          <span className="text-[9px] text-white/80">{tr("ドラッグで移動", "Seret untuk pindah")}</span>
        </div>
        <NostalgiaWidget />
      </div>
    </motion.div>
  );
}

function DesktopDock({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
    >
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-2xl">
        <DockButton
          onClick={onMenuClick}
          label="メニュー"
          primary
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          }
        />
        <div className="w-px h-10 bg-[var(--linkura-border)]" />
        <DockLink
          href="/sukukone"
          label="スクコネ"
          emoji="🎤"
          gradient="linear-gradient(135deg, #6a7bff 0%, #a88dff 100%)"
        />
        <DockLink
          href="/katsudou-kiroku"
          label="活動記録"
          emoji="📖"
          gradient="linear-gradient(135deg, #ffb3d9 0%, #b3d4ff 100%)"
        />
        <DockLink
          href="/calendar"
          label="カレンダー"
          emoji="📅"
          gradient="linear-gradient(135deg, #9ee6ff 0%, #a5aeff 100%)"
        />
        <DockLink
          href="/characters"
          label="メンバー"
          emoji="🎀"
          gradient="linear-gradient(135deg, #ffd59e 0%, #ffb3c1 100%)"
        />
      </div>
    </motion.div>
  );
}

function DockButton({
  onClick,
  label,
  icon,
  primary = false,
}: {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center justify-center w-14 h-14 rounded-xl transition active:scale-90 ${
        primary
          ? "brand-gradient-bg text-white shadow-lg hover:shadow-xl"
          : "bg-white hover:bg-[var(--linkura-surface-2)]"
      }`}
      aria-label={label}
    >
      {icon}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-800 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

function DockLink({
  href,
  label,
  emoji,
  gradient,
}: {
  href: string;
  label: string;
  emoji: string;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-center justify-center w-14 h-14 rounded-xl shadow-md hover:shadow-xl active:scale-90 hover:-translate-y-1 transition text-2xl"
      style={{ background: gradient }}
      aria-label={label}
    >
      <span aria-hidden>{emoji}</span>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-800 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
        {label}
      </span>
    </Link>
  );
}
