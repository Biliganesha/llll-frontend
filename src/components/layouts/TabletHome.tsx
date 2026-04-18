"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { NostalgiaWidget } from "@/components/calendar/NostalgiaWidget";

/**
 * TabletHome — OS-like feel untuk viewport tablet.
 * Seperti DesktopHome tapi lebih kompak, widget lebih ringkas, dock lebih besar.
 */
export function TabletHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex-1 min-h-screen wallpaper-default overflow-hidden">
      <TabletStatusBar />

      <main className="relative h-full min-h-screen flex items-center justify-center px-6">
        <div className="text-center pointer-events-none select-none">
          <h1 className="text-5xl font-extrabold brand-gradient-text leading-[1.1] drop-shadow-sm">
            Link! Like!
            <br />
            Library! Legacy!
          </h1>
          <p className="text-sm text-[var(--linkura-text-dim)] mt-3 tracking-[0.18em] font-medium">
            蓮の空アーカイブ
          </p>
        </div>
      </main>

      <TabletWidget />

      <TabletDock onMenuClick={() => setMenuOpen(true)} />

      <TabletLaunchpad open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

function TabletStatusBar() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hh = now.getHours().toString().padStart(2, "0");
      const mm = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hh}:${mm}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 py-2 bg-white/65 backdrop-blur-md border-b border-white/50 select-none">
      <span className="text-sm font-extrabold brand-gradient-text">L!L!L!L!</span>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#b3d4ff] via-[#c9b3ff] to-[#ffb3d9] px-2.5 py-0.5 shadow-sm">
          <span className="text-[10px]" aria-hidden>🌸</span>
          <span className="text-[10px] font-semibold text-slate-800">
            蓮の空アーカイブ
          </span>
        </div>
        <span className="tabular-nums text-sm font-bold text-slate-800">{time || "--:--"}</span>
      </div>
    </div>
  );
}

function TabletWidget() {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="absolute top-16 right-4 z-10 w-[300px] cursor-grab active:cursor-grabbing"
    >
      <div className="rounded-3xl bg-white/92 backdrop-blur-xl shadow-xl border border-white/80 overflow-hidden">
        <div className="brand-gradient-bg px-3 py-2 flex items-center justify-between">
          <span className="text-[11px] font-bold text-white drop-shadow">📌 Widget</span>
          <span className="text-[9px] text-white/80">Drag</span>
        </div>
        <NostalgiaWidget />
      </div>
    </motion.div>
  );
}

function TabletDock({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
    >
      <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-xl">
        <DockBtn onClick={onMenuClick} primary label="メニュー" emoji="☰" />
        <div className="w-px h-9 bg-[var(--linkura-border)]" />
        <DockBtn href="/sukukone" label="スクコネ" emoji="🎤" gradient="linear-gradient(135deg, #6a7bff 0%, #a88dff 100%)" />
        <DockBtn href="/katsudou-kiroku" label="活動記録" emoji="📖" gradient="linear-gradient(135deg, #ffb3d9 0%, #b3d4ff 100%)" />
        <DockBtn href="/characters" label="メンバー" emoji="🎀" gradient="linear-gradient(135deg, #ffd59e 0%, #ffb3c1 100%)" />
      </div>
    </motion.div>
  );
}

function DockBtn({
  href,
  onClick,
  label,
  emoji,
  gradient,
  primary = false,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  emoji: string;
  gradient?: string;
  primary?: boolean;
}) {
  const content = (
    <div
      className={`group relative flex items-center justify-center w-12 h-12 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-90 transition text-xl ${
        primary ? "brand-gradient-bg text-white" : ""
      }`}
      style={!primary && gradient ? { background: gradient } : undefined}
    >
      <span aria-hidden>{emoji}</span>
      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-800 text-white text-[9px] font-medium opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
        {label}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label={label}>
        {content}
      </Link>
    );
  }
  return (
    <button onClick={onClick} aria-label={label}>
      {content}
    </button>
  );
}

function TabletLaunchpad({
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
            onClick={onClose}
            aria-hidden
            className="absolute inset-0 z-40 bg-white/40 backdrop-blur-2xl"
          />
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            onClick={onClose}
            className="absolute inset-0 z-50 flex items-center justify-center p-6"
          >
            <div
              className="max-w-2xl w-full rounded-3xl bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/80 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="brand-gradient-bg px-5 py-2.5 flex items-center justify-between">
                <h2 className="text-base font-bold text-white drop-shadow">メニュー</h2>
                <button
                  onClick={onClose}
                  aria-label="Tutup"
                  className="w-7 h-7 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white active:scale-90 transition"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="p-5 grid grid-cols-3 gap-3">
                <LpIcon href="/sukukone" label="スクコネ" emoji="🎤" gradient="linear-gradient(135deg, #6a7bff 0%, #a88dff 100%)" />
                <LpIcon href="/katsudou-kiroku" label="活動記録" emoji="📖" gradient="linear-gradient(135deg, #ffb3d9 0%, #b3d4ff 100%)" />
                <LpIcon href="/calendar" label="カレンダー" emoji="📅" gradient="linear-gradient(135deg, #9ee6ff 0%, #a5aeff 100%)" />
                <LpIcon href="/characters" label="メンバー" emoji="🎀" gradient="linear-gradient(135deg, #ffd59e 0%, #ffb3c1 100%)" />
                <LpIcon href="/units" label="ユニット" emoji="💫" gradient="linear-gradient(135deg, #c9b3ff 0%, #ffb3d9 100%)" />
                <LpIcon href="/timeline" label="タイムライン" emoji="🕰️" gradient="linear-gradient(135deg, #b3e5ff 0%, #c9a5ff 100%)" />
                <LpIcon href="/search" label="検索" emoji="🔍" gradient="linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)" />
                <LpIcon href="/community" label="フォーラム" emoji="💬" gradient="linear-gradient(135deg, #a5f3fc 0%, #7dd3fc 100%)" />
                <LpIcon href="/about" label="About" emoji="ℹ️" gradient="linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function LpIcon({
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
      className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[var(--linkura-surface-2)]/60 transition"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 group-active:scale-90 transition"
        style={{ background: gradient }}
      >
        <span aria-hidden>{emoji}</span>
      </div>
      <span className="text-[10px] font-semibold text-[var(--linkura-text)]">{label}</span>
    </Link>
  );
}
