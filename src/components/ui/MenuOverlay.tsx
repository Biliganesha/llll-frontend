"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { NostalgiaWidget } from "@/components/calendar/NostalgiaWidget";
import { useLanguage, type Lang } from "@/lib/language";
import { MENU_LINKS, MEMBERS_GROUP, type MenuLink } from "@/lib/menu-items";

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

/** Ikon line-art (stroke biru ala app) per href. */
const ICONS: Record<string, ReactNode> = {
  "/calendar": (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  ),
  "/collection": (
    <>
      <rect x="3" y="7" width="13" height="13" rx="2" />
      <path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
      <path d="m3 16 3.5-3 3 2.5 2.5-2 4 3.5" />
    </>
  ),
  "/timeline": (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9 2h6" />
    </>
  ),
  "/gameplay": (
    <>
      <path d="M6 9h.01M17 10h.01M14.5 8h.01" />
      <path d="M7.2 6h9.6a4.8 4.8 0 0 1 4.7 4l.9 5.2a2.6 2.6 0 0 1-4.6 2.1L16 15H8l-1.8 2.3a2.6 2.6 0 0 1-4.6-2.1L2.5 10a4.8 4.8 0 0 1 4.7-4z" />
      <path d="M9 8v4M7 10h4" />
    </>
  ),
  "/search": (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  "/community": (
    <>
      <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z" />
      <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
    </>
  ),
  "/about": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v5h1" />
    </>
  ),
  "/characters": (
    <>
      <path d="M12 3c2 2.5 6 3 6 7 0 3-2.5 5-6 5s-6-2-6-5c0-4 4-4.5 6-7z" />
      <path d="M8 20c1.2-1.5 6.8-1.5 8 0" />
    </>
  ),
  "/units": (
    <>
      <circle cx="8" cy="9" r="4" />
      <circle cx="16" cy="9" r="4" />
      <path d="M4 20c.8-3 7.2-3 8 0M12 20c.8-3 7.2-3 8 0" />
    </>
  ),
  "/seiyuu": (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  "/relationships": (
    <>
      <circle cx="5" cy="6" r="2.5" />
      <circle cx="19" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M7 7.5 10.5 16M17 7.5 13.5 16M7.5 6h9" />
    </>
  ),
};

/**
 * MenuOverlay — meniru hierarki menu app リンクラ (acuan s03_menu.png):
 * kartu raksasa スクールアイドルコネクト (hijau/VIDEO STREAMING) + 活動記録
 * (oranye/STORY) → widget 今日の蓮ノ空 → banner メンバー & カレンダー →
 * grid ikon putih line-art. Di phone: status bar & bottom nav tetap terlihat
 * (tombol tengah nav berubah ☰→X); di sm+ tetap launchpad ter-center.
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
          className="fixed inset-x-0 top-[34px] bottom-[45px] sm:inset-0 z-[70] flex items-stretch sm:items-center justify-center bg-white/55 backdrop-blur-md"
        >
          <motion.div
            key="panel"
            initial={{ y: 26, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 26, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:w-auto sm:max-w-3xl sm:mx-6 sm:max-h-[86vh] overflow-y-auto sm:rounded-3xl sm:bg-white/95 sm:backdrop-blur-2xl sm:shadow-2xl sm:border sm:border-white/80"
          >
            {/* Header hanya utk sm+ (di phone: status bar & tombol X nav yang bekerja) */}
            <div className="hidden sm:flex sticky top-0 z-10 brand-gradient-bg px-5 py-2.5 items-center justify-between">
              <h2 className="text-base font-bold text-white drop-shadow">
                {expanded ? (lang === "jp" ? MEMBERS_GROUP.label : MEMBERS_GROUP.labelId) : lang === "jp" ? "メニュー" : "Menu"}
              </h2>
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {expanded ? (
              <div className="p-4 sm:p-5">
                <button
                  onClick={() => setExpanded(false)}
                  className="mb-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[var(--icon-line)] shadow-sm active:scale-95 transition"
                >
                  ← {lang === "jp" ? "メニューへ戻る" : "Kembali ke menu"}
                </button>
                <div className="grid grid-cols-3 gap-3">
                  {MEMBERS_GROUP.items.map((item) => (
                    <IconTile key={item.href} item={item} lang={lang} onNavigate={handleClose} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 sm:p-5 space-y-3">
                {/* JP toggle kecil (phone) — app tidak punya; fungsi web dipertahankan */}
                <div className="sm:hidden flex justify-end">
                  <button
                    onClick={() => setLang(lang === "jp" ? "id" : "jp")}
                    className="rounded-full bg-white/90 border border-[var(--linkura-border)] px-2.5 py-0.5 text-[10px] font-bold text-slate-600 shadow-sm active:scale-95 transition"
                  >
                    {lang === "jp" ? "JP → ID" : "ID → JP"}
                  </button>
                </div>

                {/* Kartu raksasa スクールアイドルコネクト */}
                <Link
                  href="/sukukone"
                  onClick={handleClose}
                  className="relative block rounded-2xl px-4 py-5 shadow-lg overflow-hidden active:scale-[0.98] transition"
                  style={{ background: "linear-gradient(120deg, var(--menu-card-green-1), var(--menu-card-green-2))" }}
                >
                  <svg aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 opacity-35" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.2">
                    <circle cx="12" cy="12" r="3.4" />
                    <circle cx="4.5" cy="6" r="1.8" />
                    <circle cx="19.5" cy="5" r="1.8" />
                    <circle cx="4" cy="18" r="1.8" />
                    <circle cx="20" cy="18.5" r="1.8" />
                    <path d="M9.5 10 6 7.2M14.4 10.2 18 6.3M9.6 14 5.6 16.9M14.5 13.9l4 3.4" />
                  </svg>
                  <div className="text-right">
                    <div className="text-[10px] font-bold tracking-[0.25em] text-white/85">VIDEO STREAMING</div>
                    <div className="mt-1 text-xl font-extrabold text-white drop-shadow-sm">スクールアイドルコネクト</div>
                  </div>
                </Link>

                {/* Kartu raksasa 活動記録 */}
                <Link
                  href="/katsudou-kiroku"
                  onClick={handleClose}
                  className="relative block rounded-2xl px-4 py-5 shadow-lg overflow-hidden active:scale-[0.98] transition"
                  style={{ background: "linear-gradient(120deg, var(--menu-card-orange-1), var(--menu-card-orange-2))" }}
                >
                  <svg aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" width="80" height="64" viewBox="0 0 40 28" fill="none" stroke="#fff" strokeWidth="1.4">
                    <rect x="1" y="1" width="38" height="26" rx="2" />
                    <path d="M6 1v26M34 1v26" />
                    <path d="M2.5 5h3M2.5 10h3M2.5 15h3M2.5 20h3M34.5 5h3M34.5 10h3M34.5 15h3M34.5 20h3" />
                    <path d="m17 9 8 5-8 5z" fill="#fff" stroke="none" opacity="0.9" />
                  </svg>
                  <div className="text-right">
                    <div className="text-[10px] font-bold tracking-[0.3em] text-white/85">STORY</div>
                    <div className="mt-1 text-xl font-extrabold text-white drop-shadow-sm tracking-[0.35em]">活動記録</div>
                  </div>
                </Link>

                {/* Widget 今日の蓮ノ空 (posisi banner ala app) */}
                <div className="rounded-2xl border border-[var(--linkura-border)] bg-white/90 overflow-hidden">
                  <NostalgiaWidget />
                </div>

                {/* Banner メンバー + カレンダー */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setExpanded(true)}
                    className="relative rounded-xl px-3 py-3.5 text-left shadow-md overflow-hidden active:scale-[0.97] transition"
                    style={{ background: "linear-gradient(120deg, #f6c6de, #d9b8f5)" }}
                  >
                    <div className="text-[9px] font-bold tracking-[0.2em] text-white/90">MEMBERS</div>
                    <div className="text-sm font-extrabold text-white drop-shadow-sm">
                      {lang === "jp" ? "メンバー" : "Anggota"}
                    </div>
                    <span className="absolute right-2 bottom-2 w-4 h-4 rounded-full bg-white text-[9px] font-bold text-[var(--icon-line)] flex items-center justify-center shadow">
                      +
                    </span>
                  </button>
                  <Link
                    href="/calendar"
                    onClick={handleClose}
                    className="rounded-xl px-3 py-3.5 shadow-md overflow-hidden active:scale-[0.97] transition"
                    style={{ background: "linear-gradient(120deg, #a8d8f0, #b1b8f5)" }}
                  >
                    <div className="text-[9px] font-bold tracking-[0.2em] text-white/90">CALENDAR</div>
                    <div className="text-sm font-extrabold text-white drop-shadow-sm">
                      {lang === "jp" ? "カレンダー" : "Kalender"}
                    </div>
                  </Link>
                </div>

                {/* Grid ikon putih line-art */}
                <div className="grid grid-cols-4 gap-2.5">
                  {MENU_LINKS.filter(
                    (i) => !["/sukukone", "/katsudou-kiroku", "/calendar"].includes(i.href)
                  ).map((item) => (
                    <IconTile key={item.href} item={item} lang={lang} onNavigate={handleClose} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IconTile({
  item,
  lang,
  onNavigate,
}: {
  item: MenuLink;
  lang: Lang;
  onNavigate: () => void;
}) {
  const label = lang === "jp" ? item.label : item.labelId;
  const icon = ICONS[item.href];
  const tile = (
    <>
      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:-translate-y-0.5 group-active:scale-90 transition">
        {icon ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--icon-line)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            {icon}
          </svg>
        ) : (
          <span aria-hidden className="text-xl">{item.emoji}</span>
        )}
      </div>
      <span className="text-[10px] font-semibold text-[var(--icon-line)] text-center leading-tight">
        {label}
      </span>
    </>
  );

  if (item.disabled) {
    return (
      <div className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl opacity-35 cursor-not-allowed">
        {tile}
      </div>
    );
  }
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="group flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-white/60 transition"
    >
      {tile}
    </Link>
  );
}
