"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { NostalgiaWidget } from "@/components/calendar/NostalgiaWidget";

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * MenuOverlay — panel menu yang muncul saat tombol ☰ ditekan.
 * Style: card di atas wallpaper (wallpaper tetap terlihat sebagai backdrop).
 * Isi: card shortcut besar (スクコネ, 活動記録), grid ikon fitur lain, nostalgia widget.
 */
export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
            className="absolute inset-0 z-30 bg-white/10 backdrop-blur-[2px]"
          />

          <motion.div
            key="panel"
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="absolute inset-x-3 top-12 bottom-20 z-40 rounded-3xl bg-white/92 backdrop-blur-xl shadow-2xl border border-white overflow-y-auto"
          >
            <div className="sticky top-0 brand-gradient-bg px-4 py-2.5 flex items-center justify-between border-b border-white/40">
              <h2 className="text-sm font-bold text-white drop-shadow">メニュー</h2>
              <button
                onClick={onClose}
                aria-label="Tutup menu"
                className="w-7 h-7 rounded-full bg-white/30 hover:bg-white/50 active:scale-90 transition flex items-center justify-center text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-3 space-y-3">
              <ShortcutCard
                href="/sukukone"
                title="スクールアイドル"
                subtitle="コネクト"
                description="Archives · WxSTATION · Music Video"
                gradient="linear-gradient(135deg, #6a7bff 0%, #a88dff 100%)"
                icon={<IconMic />}
              />

              <ShortcutCard
                href="/episodes"
                title="活動記録"
                subtitle="Episode Story"
                description="Timeline real-calendar 蓮の空"
                gradient="linear-gradient(135deg, #ffb3d9 0%, #b3d4ff 100%)"
                textDark
                icon={<IconBook />}
              />

              <div className="rounded-2xl border border-[var(--linkura-border)] overflow-hidden">
                <NostalgiaWidget />
              </div>

              <div className="rounded-2xl bg-[var(--linkura-surface-2)]/70 p-3">
                <h3 className="text-[11px] font-semibold text-[var(--linkura-text-dim)] uppercase tracking-wider mb-2">
                  その他
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  <MiniIcon href="/calendar" label="Calendar" emoji="📅" />
                  <MiniIcon href="/characters" label="Members" emoji="🎀" />
                  <MiniIcon href="/units" label="Units" emoji="💫" />
                  <MiniIcon href="/timeline" label="Timeline" emoji="🕰️" />
                  <MiniIcon href="/search" label="Search" emoji="🔍" />
                  <MiniIcon href="/community" label="Forum" emoji="💬" disabled />
                  <MiniIcon href="/gameplay" label="Gameplay" emoji="🎮" />
                  <MiniIcon href="/about" label="About" emoji="ℹ️" />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ShortcutCard({
  href,
  title,
  subtitle,
  description,
  gradient,
  icon,
  textDark = false,
}: {
  href: string;
  title: string;
  subtitle?: string;
  description: string;
  gradient: string;
  icon: React.ReactNode;
  textDark?: boolean;
}) {
  const textColor = textDark ? "text-slate-800" : "text-white";
  const descColor = textDark ? "text-slate-600" : "text-white/85";

  return (
    <Link
      href={href}
      className="block rounded-2xl p-4 shadow-md hover:shadow-lg active:scale-[0.98] transition"
      style={{ background: gradient }}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-white/25 flex items-center justify-center ${textColor}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-base font-bold leading-tight ${textColor}`}>
            {title}
          </div>
          {subtitle && (
            <div className={`text-xs font-medium ${textColor} opacity-90`}>
              {subtitle}
            </div>
          )}
          <div className={`text-[10px] ${descColor} mt-0.5 truncate`}>
            {description}
          </div>
        </div>
      </div>
    </Link>
  );
}

function MiniIcon({
  href,
  label,
  emoji,
  disabled,
}: {
  href: string;
  label: string;
  emoji: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <div className="flex flex-col items-center gap-1 p-2 rounded-xl opacity-35 cursor-not-allowed">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg shadow-sm">
          {emoji}
        </div>
        <span className="text-[10px] font-medium text-[var(--linkura-text-dim)] text-center leading-tight">
          {label}
        </span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white active:scale-95 transition"
    >
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg shadow-sm">
        {emoji}
      </div>
      <span className="text-[10px] font-medium text-[var(--linkura-text)] text-center leading-tight">
        {label}
      </span>
    </Link>
  );
}

function IconMic() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5z" />
      <path d="M4 4.5v16" />
    </svg>
  );
}
