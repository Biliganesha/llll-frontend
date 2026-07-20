"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/language";
import { MEMBERS_GROUP } from "@/lib/menu-items";
import { MENU_ICONS } from "@/components/ui/menu-icons";

type Size = "sm" | "md" | "lg";

const SIZE: Record<Size, { btn: string; text: string }> = {
  sm: { btn: "w-10 h-10", text: "text-lg" }, // dock halaman-dalam (NavBar)
  md: { btn: "w-12 h-12", text: "text-xl" }, // dock tablet home
  lg: { btn: "w-14 h-14", text: "text-2xl" }, // dock desktop home
};

/**
 * DockMembersButton — ikon メンバー di dock yang MEMBUKA SUBMENU
 * (メンバー一覧 / ユニット / 声優 / 相関図), bukan langsung melompat ke
 * /characters. Padanan dock dari grup メンバー di MenuOverlay, sekaligus
 * pengganti dropdown メンバー▾ pada NavBar lama.
 */
export function DockMembersButton({ size = "sm" }: { size?: Size }) {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  const active = MEMBERS_GROUP.items.some((i) => pathname.startsWith(i.href));
  const label = lang === "jp" ? MEMBERS_GROUP.label : MEMBERS_GROUP.labelId;

  // Tutup saat pindah halaman
  useEffect(() => setOpen(false), [pathname]);

  // Tutup dengan Escape
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {/* Backdrop penangkap klik luar */}
      {open && (
        <button
          aria-hidden
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] cursor-default"
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[61] w-max"
          >
            <div className="rounded-2xl bg-white/97 backdrop-blur-xl shadow-2xl border border-white/80 overflow-hidden">
              <div className="brand-gradient-bg px-3 py-1.5">
                <span className="text-[11px] font-bold text-white drop-shadow">{label}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 p-2">
                {MEMBERS_GROUP.items.map((item) => {
                  const icon = MENU_ICONS[item.href];
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`group flex flex-col items-center gap-1 w-[74px] px-1 py-2 rounded-xl transition ${
                        isActive ? "bg-[var(--linkura-surface-2)]" : "hover:bg-[var(--linkura-surface-2)]"
                      }`}
                    >
                      <span className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center group-active:scale-90 transition">
                        {icon ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--icon-line)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            {icon}
                          </svg>
                        ) : (
                          <span aria-hidden className="text-base">{item.emoji}</span>
                        )}
                      </span>
                      <span className="text-[9px] font-semibold text-[var(--icon-line)] text-center leading-tight">
                        {lang === "jp" ? item.label : item.labelId}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
            {/* Ekor panah ke arah ikon dock */}
            <div
              aria-hidden
              className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45 bg-white/97 border-r border-b border-white/80"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`group relative z-[61] flex items-center justify-center ${SIZE[size].btn} ${SIZE[size].text} rounded-xl shadow-md hover:shadow-lg active:scale-90 hover:-translate-y-0.5 transition cursor-pointer ${
          active || open ? "ring-2 ring-white" : ""
        }`}
        style={{ background: MEMBERS_GROUP.gradient }}
      >
        <span aria-hidden>{MEMBERS_GROUP.emoji}</span>
        {/* Penanda "punya submenu" */}
        <span
          aria-hidden
          className="absolute bottom-0.5 right-1 w-1.5 h-1.5 rounded-full bg-white/85 shadow"
        />
        {/* Tooltip disembunyikan saat submenu terbuka (agar tak menimpa panel) */}
        {!open && (
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-800 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
            {label}
          </span>
        )}
      </button>
    </div>
  );
}
