"use client";

import { useState } from "react";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language";
import { translate } from "@/lib/translations";
import {
  ABOUT_SECTIONS,
  OFFICIAL_LINKS,
  MISSION_JP,
  MISSION_ID,
  CONTACT_EMAIL,
} from "@/lib/site-content";

export default function AboutPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, t } = useLanguage();

  const content = (
    <div className="space-y-6">
      {/* Logo / Title */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-extrabold brand-gradient-text">LLLL</h1>
        <p className="text-sm text-text-dim mt-1">Link! Like! Library! Legacy!</p>
        <p className="text-xs text-text-dim mt-0.5">蓮ノ空アーカイブ</p>
      </div>

      {/* Mission statement */}
      <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, #fff0f5, #f0eaff)" }}>
        <p className="text-sm text-center italic" style={{ color: "var(--linkura-primary)" }}>
          {t(MISSION_JP, MISSION_ID)}
        </p>
      </div>

      {/* Text sections */}
      {ABOUT_SECTIONS.map((section) => (
        <div key={section.id} className="rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-surface-2/50">
            <h2 className="text-sm font-bold">{t(section.titleJp, section.titleId)}</h2>
          </div>
          <div className="px-4 py-3">
            <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
              {t(section.contentJp, section.contentId)}
            </p>
          </div>
        </div>
      ))}

      {/* Official links */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 bg-surface-2/50">
          <h2 className="text-sm font-bold">{t("公式リンク", "Link Resmi")}</h2>
        </div>
        <div className="px-4 py-3 space-y-2">
          {OFFICIAL_LINKS.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-xl border border-border px-4 py-3">
        <h2 className="text-sm font-bold">{t("お問い合わせ", "Kontak")}</h2>
        <p className="text-xs text-text-dim mt-1">
          Email: <span className="text-primary">{CONTACT_EMAIL}</span>
        </p>
      </div>

      <div className="text-center text-[11px] text-text-dim/50 py-4">
        <p>Fan-made project — not affiliated with Bandai Namco or ODD No.</p>
      </div>
    </div>
  );

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={0} unitLabel={translate("about.title", lang)} />
        <main className="flex-1 px-3 pt-3 pb-20 overflow-y-auto">
          {content}
        </main>
        <BottomNav
          onBack={() => router.back()}
          onMenu={() => setMenuOpen(!menuOpen)}
          onHome={() => router.push("/")}
          menuOpen={menuOpen}
        />
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      {/* ===== TABLET ===== */}
      <div className="hidden sm:flex lg:hidden flex-1 flex-col min-h-screen bg-background">
        <main className="flex-1 px-6 py-6 max-w-2xl mx-auto w-full">
          {content}
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <main className="max-w-2xl mx-auto w-full px-8 py-8">
          {content}
        </main>
      </div>
    </>
  );
}
