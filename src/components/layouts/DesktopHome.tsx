"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { NostalgiaWidget } from "@/components/calendar/NostalgiaWidget";

/**
 * DesktopHome — paradigma desktop OS (bukan website klasik).
 * Layout: wallpaper full + top-right status bar + widget 今日の蓮の空 pinned
 *         + bottom-center dock dengan menu button (seperti Start button / macOS Dock).
 * Klik menu: launchpad overlay dengan feature icons.
 */
export function DesktopHome() {
  const [menuOpen, setMenuOpen] = useState(false);

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
            蓮の空アーカイブ
          </p>
          <p className="text-xs text-[var(--linkura-text-dim)]/70 mt-2">
            Link! Like! Love Live! 蓮の空の活動を永続保存
          </p>
        </div>
      </main>

      <DesktopWidget />

      <DesktopDock onMenuClick={() => setMenuOpen(true)} />

      <LaunchpadOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

function DesktopStatusBar() {
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
        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#b3d4ff] via-[#c9b3ff] to-[#ffb3d9] px-3 py-1 shadow-sm">
          <span className="text-xs" aria-hidden>🌸</span>
          <span className="text-[11px] font-semibold text-slate-800">
            蓮の空アーカイブ
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
            📌 Pinned Widget
          </span>
          <span className="text-[9px] text-white/80">Drag to move</span>
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
          href="/sukokone"
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

function LaunchpadOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
            className="absolute inset-0 z-40 bg-white/40 backdrop-blur-2xl"
          />
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-8"
            onClick={onClose}
          >
            <div
              className="max-w-4xl w-full rounded-3xl bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/80 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="brand-gradient-bg px-6 py-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white drop-shadow">
                  メニュー — Launchpad
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Tutup"
                  className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white active:scale-90 transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="p-6 grid grid-cols-4 gap-4">
                <LaunchpadIcon
                  href="/sukokone"
                  label="スクコネ"
                  sub="School Idol Connect"
                  emoji="🎤"
                  gradient="linear-gradient(135deg, #6a7bff 0%, #a88dff 100%)"
                />
                <LaunchpadIcon
                  href="/katsudou-kiroku"
                  label="活動記録"
                  sub="Episode Story"
                  emoji="📖"
                  gradient="linear-gradient(135deg, #ffb3d9 0%, #b3d4ff 100%)"
                />
                <LaunchpadIcon
                  href="/calendar"
                  label="カレンダー"
                  sub="Calendar"
                  emoji="📅"
                  gradient="linear-gradient(135deg, #9ee6ff 0%, #a5aeff 100%)"
                />
                <LaunchpadIcon
                  href="/characters"
                  label="メンバー"
                  sub="Members"
                  emoji="🎀"
                  gradient="linear-gradient(135deg, #ffd59e 0%, #ffb3c1 100%)"
                />
                <LaunchpadIcon
                  href="/units"
                  label="ユニット"
                  sub="Units"
                  emoji="💫"
                  gradient="linear-gradient(135deg, #c9b3ff 0%, #ffb3d9 100%)"
                />
                <LaunchpadIcon
                  href="/timeline"
                  label="タイムライン"
                  sub="Timeline"
                  emoji="🕰️"
                  gradient="linear-gradient(135deg, #b3e5ff 0%, #c9a5ff 100%)"
                />
                <LaunchpadIcon
                  href="/search"
                  label="検索"
                  sub="Search"
                  emoji="🔍"
                  gradient="linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)"
                />
                <LaunchpadIcon
                  href="/community"
                  label="フォーラム"
                  sub="Community"
                  emoji="💬"
                  gradient="linear-gradient(135deg, #a5f3fc 0%, #7dd3fc 100%)"
                />
                <LaunchpadIcon
                  href="/gameplay"
                  label="ゲームプレイ"
                  sub="Gameplay Archive"
                  emoji="🎮"
                  gradient="linear-gradient(135deg, #fca5a5 0%, #f472b6 100%)"
                />
                <LaunchpadIcon
                  href="/about"
                  label="このサイトについて"
                  sub="About"
                  emoji="ℹ️"
                  gradient="linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function LaunchpadIcon({
  href,
  label,
  sub,
  emoji,
  gradient,
}: {
  href: string;
  label: string;
  sub: string;
  emoji: string;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-[var(--linkura-surface-2)]/60 transition"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md group-hover:shadow-xl group-hover:-translate-y-1 group-active:scale-90 transition"
        style={{ background: gradient }}
      >
        <span aria-hidden>{emoji}</span>
      </div>
      <div className="text-center">
        <div className="text-xs font-bold text-[var(--linkura-text)]">
          {label}
        </div>
        <div className="text-[9px] text-[var(--linkura-text-dim)]">{sub}</div>
      </div>
    </Link>
  );
}
