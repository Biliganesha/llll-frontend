"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language";
import { translate } from "@/lib/translations";

const NAV_ITEMS = [
  { href: "/", labelKey: "nav.home" as const },
  { href: "/episodes", labelKey: "nav.episodes" as const },
  { href: "/sukukone", labelKey: "nav.sukukone" as const },
  { href: "/characters", labelKey: "nav.members" as const },
  { href: "/units", labelKey: "nav.units" as const },
  { href: "/calendar", labelKey: "nav.calendar" as const },
  { href: "/relationships", labelKey: "nav.relationships" as const },
];

/**
 * NavBar — top navigation for tablet and desktop layouts.
 * Compact horizontal bar with brand name + nav links + language toggle.
 */
export function NavBar() {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto w-full px-6 lg:px-8 flex items-center h-14 gap-8">
        {/* Brand */}
        <Link href="/" className="shrink-0 flex items-center gap-2">
          <span className="text-lg font-bold brand-gradient-text leading-none">
            LLLL
          </span>
          <span className="hidden lg:inline text-[11px] text-text-dim leading-none">
            蓮の空アーカイブ
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
  );
}
