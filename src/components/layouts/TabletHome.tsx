"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { NostalgiaWidget } from "@/components/calendar/NostalgiaWidget";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { HomeClock } from "@/components/ui/HomeClock";
import { useTr, useLanguage } from "@/lib/language";

/**
 * TabletHome — OS-like feel untuk viewport tablet.
 * Seperti DesktopHome tapi lebih kompak, widget lebih ringkas, dock lebih besar.
 * Tombol メニュー di dock membuka Menu Launcher terpadu (MenuOverlay).
 */
export function TabletHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const tr = useTr();

  return (
    <div className="relative flex-1 min-h-screen wallpaper-default overflow-hidden">
      <TabletStatusBar />

      {/* Jam besar di wallpaper ala app (brand tampil di status bar + FirstVisitModal) */}
      <main className="relative h-full min-h-screen flex items-center justify-center px-6">
        <HomeClock className="text-center pointer-events-none select-none" size="text-[96px]" />
      </main>

      <TabletWidget />

      <TabletDock onMenuClick={() => setMenuOpen(true)} />

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

function TabletStatusBar() {
  const tr = useTr();
  const { lang, setLang } = useLanguage();
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
        <button
          onClick={() => setLang(lang === "jp" ? "id" : "jp")}
          className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-white active:scale-95 transition cursor-pointer shadow-sm"
          aria-label="言語切替 / Ganti bahasa"
        >
          {lang === "jp" ? "JP" : "ID"}
        </button>
        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#b3d4ff] via-[#c9b3ff] to-[#ffb3d9] px-2.5 py-0.5 shadow-sm">
          <span className="text-[10px]" aria-hidden>🌸</span>
          <span className="text-[10px] font-semibold text-slate-800">
            {tr("蓮ノ空アーカイブ", "Arsip Hasunosora")}
          </span>
        </div>
        <span className="tabular-nums text-sm font-bold text-slate-800">{time || "--:--"}</span>
      </div>
    </div>
  );
}

function TabletWidget() {
  const tr = useTr();
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
          <span className="text-[11px] font-bold text-white drop-shadow">📌 {tr("ウィジェット", "Widget")}</span>
          <span className="text-[9px] text-white/80">{tr("移動", "Seret")}</span>
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
