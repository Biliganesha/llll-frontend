"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { NostalgiaWidget } from "@/components/calendar/NostalgiaWidget";
import { useLanguage, type Lang } from "@/lib/language";
import {
  MENU_LINKS,
  MEMBERS_GROUP,
  MEMBERS_GROUP_POSITION,
  type MenuLink,
} from "@/lib/menu-items";

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * MenuOverlay — Menu Launcher terpadu (poin 3 & 4).
 * Satu launcher untuk SEMUA viewport: bottom-sheet di phone, launchpad ter-center
 * di tablet/desktop. `fixed inset-0` supaya bisa dipakai dari halaman mana pun.
 * Isi diambil dari menu-items.ts (sumber tunggal). Grup メンバー (poin 16) tampil
 * sebagai satu ikon yang dapat di-expand jadi メンバー一覧 / ユニット / 相関図.
 */
export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const { lang, setLang } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const handleClose = () => {
    setExpanded(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="launcher"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={handleClose}
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-white/40 backdrop-blur-xl"
        >
          <motion.div
            key="panel"
            initial={{ y: 48, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 48, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:w-auto sm:max-w-3xl sm:mx-6 max-h-[88vh] sm:max-h-[86vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/80"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 brand-gradient-bg px-4 sm:px-5 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {expanded && (
                  <button
                    onClick={() => setExpanded(false)}
                    aria-label="戻る"
                    className="w-7 h-7 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white active:scale-90 transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5" />
                      <path d="m12 19-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <h2 className="text-sm sm:text-base font-bold text-white drop-shadow">
                  {expanded
                    ? lang === "jp" ? MEMBERS_GROUP.label : MEMBERS_GROUP.labelId
                    : lang === "jp" ? "メニュー" : "Menu"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLang(lang === "jp" ? "id" : "jp")}
                  className="px-2 py-1 rounded-full bg-white/30 hover:bg-white/50 text-[10px] font-bold text-white transition cursor-pointer"
                >
                  {lang === "jp" ? "JP → ID" : "ID → JP"}
                </button>
                <button
                  onClick={handleClose}
                  aria-label="Tutup menu"
                  className="w-7 h-7 rounded-full bg-white/30 hover:bg-white/50 active:scale-90 transition flex items-center justify-center text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {expanded ? (
              /* ── Sub-grid grup メンバー (poin 16) ── */
              <div className="p-4 sm:p-5 grid grid-cols-3 gap-3">
                {MEMBERS_GROUP.items.map((item) => (
                  <LauncherTile key={item.href} item={item} lang={lang} onNavigate={handleClose} />
                ))}
              </div>
            ) : (
              <>
                {/* Widget nostalgia 今日の蓮ノ空 */}
                <div className="p-3 sm:p-4 pb-0">
                  <div className="rounded-2xl border border-[var(--linkura-border)] overflow-hidden">
                    <NostalgiaWidget />
                  </div>
                </div>

                {/* Grid ikon */}
                <div className="p-4 sm:p-5 grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {MENU_LINKS.slice(0, MEMBERS_GROUP_POSITION).map((item) => (
                    <LauncherTile key={item.href} item={item} lang={lang} onNavigate={handleClose} />
                  ))}

                  {/* Tile grup メンバー */}
                  <button
                    onClick={() => setExpanded(true)}
                    className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[var(--linkura-surface-2)]/60 transition"
                  >
                    <div
                      className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 group-active:scale-90 transition"
                      style={{ background: MEMBERS_GROUP.gradient }}
                    >
                      <span aria-hidden>{MEMBERS_GROUP.emoji}</span>
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white text-[8px] font-bold text-[var(--linkura-text)] flex items-center justify-center shadow">
                        +
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--linkura-text)] text-center leading-tight">
                      {lang === "jp" ? MEMBERS_GROUP.label : MEMBERS_GROUP.labelId}
                    </span>
                  </button>

                  {MENU_LINKS.slice(MEMBERS_GROUP_POSITION).map((item) => (
                    <LauncherTile key={item.href} item={item} lang={lang} onNavigate={handleClose} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LauncherTile({
  item,
  lang,
  onNavigate,
}: {
  item: MenuLink;
  lang: Lang;
  onNavigate: () => void;
}) {
  const label = lang === "jp" ? item.label : item.labelId;
  if (item.disabled) {
    return (
      <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl opacity-35 cursor-not-allowed">
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-sm"
          style={{ background: item.gradient }}
        >
          <span aria-hidden>{item.emoji}</span>
        </div>
        <span className="text-[10px] font-semibold text-[var(--linkura-text-dim)] text-center leading-tight">
          {label}
        </span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[var(--linkura-surface-2)]/60 transition"
    >
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 group-active:scale-90 transition"
        style={{ background: item.gradient }}
      >
        <span aria-hidden>{item.emoji}</span>
      </div>
      <span className="text-[10px] font-semibold text-[var(--linkura-text)] text-center leading-tight">
        {label}
      </span>
    </Link>
  );
}
