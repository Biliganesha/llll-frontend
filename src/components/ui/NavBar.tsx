"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language";
import { translate } from "@/lib/translations";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { MEMBERS_GROUP } from "@/lib/menu-items";

const NAV_ITEMS = [
  { href: "/", labelKey: "nav.home" as const },
  { href: "/katsudou-kiroku", labelKey: "nav.episodes" as const },
  { href: "/sukukone", labelKey: "nav.sukukone" as const },
  { href: "/calendar", labelKey: "nav.calendar" as const },
];

/**
 * NavBar — top navigation for tablet and desktop layouts.
 * Compact horizontal bar: launcher button + brand + nav links + members dropdown
 * (poin 16) + language toggle + search.
 */
export function NavBar() {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const membersActive = MEMBERS_GROUP.items.some((i) => pathname.startsWith(i.href));

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto w-full px-6 lg:px-8 flex items-center h-14 gap-4">
          {/* Menu Launcher button (poin 3 & 4 — selalu tampil di semua laman) */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="メニュー"
            title="メニュー"
            className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-text-dim hover:text-primary hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </button>

          {/* Brand */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <span className="text-lg font-bold brand-gradient-text leading-none">
              LLLL
            </span>
            <span className="hidden lg:inline text-[11px] text-text-dim leading-none">
              蓮ノ空アーカイブ
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-text-dim hover:text-foreground hover:bg-surface-2"
                  }`}
                >
                  {translate(item.labelKey, lang)}
                </Link>
              );
            })}

            {/* Members dropdown (poin 16) */}
            <MembersDropdown active={membersActive} />
          </div>

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "jp" ? "id" : "jp")}
            className="shrink-0 px-2 py-1 rounded-lg text-xs font-bold transition-colors bg-surface-2 hover:bg-primary/10 text-text-dim hover:text-primary cursor-pointer"
            title={lang === "jp" ? "Ganti ke Bahasa Indonesia" : "日本語に切り替え"}
          >
            {lang === "jp" ? "JP" : "ID"}
          </button>

          {/* Search */}
          <Link
            href="/search"
            className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              pathname === "/search"
                ? "bg-primary/10 text-primary"
                : "text-text-dim hover:text-foreground hover:bg-surface-2"
            }`}
            aria-label={translate("nav.search", lang)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </Link>
        </div>
      </nav>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function MembersDropdown({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          active || open
            ? "bg-primary/10 text-primary"
            : "text-text-dim hover:text-foreground hover:bg-surface-2"
        }`}
        aria-expanded={open}
      >
        {lang === "jp" ? MEMBERS_GROUP.label : MEMBERS_GROUP.labelId}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop penangkap klik luar */}
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute left-0 top-full mt-1 z-50 min-w-[160px] rounded-xl bg-white shadow-xl border border-border overflow-hidden py-1">
            {MEMBERS_GROUP.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text-dim hover:text-foreground hover:bg-surface-2 transition-colors"
              >
                <span aria-hidden>{item.emoji}</span>
                {lang === "jp" ? item.label : item.labelId}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
