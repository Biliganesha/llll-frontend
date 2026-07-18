"use client";

import Link from "next/link";
import { CollectionShell } from "@/components/collection/CollectionShell";
import { useTr } from "@/lib/language";

/**
 * コレクション — landing ala app (acuan s04_collection.png): kartu baris putih
 * dengan ikon line-art + judul JP + sub EN + chevron. Entri app museum
 * (ステッカー · りんく！らいふ！ラブライブ！ · メンバー) + entri arsip web
 * (ミュージック; カード menyusul via object storage).
 */
export default function CollectionPage() {
  const tr = useTr();

  const rows: {
    href?: string;
    jp: string;
    en: string;
    icon: React.ReactNode;
    disabled?: boolean;
    note?: string;
  }[] = [
    {
      href: "/collection/sticker",
      jp: "ステッカー",
      en: "STICKER",
      icon: (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 3.5a8.5 8.5 0 0 0 8.5 8.5A8.5 8.5 0 0 1 12 3.5z" fill="currentColor" opacity="0.25" stroke="none" />
          <path d="M20.5 12A8.5 8.5 0 0 1 12 3.5" />
        </>
      ),
    },
    {
      href: "/collection/comic",
      jp: "りんく！らいふ！ラブライブ！",
      en: "Link! Life! LoveLive!",
      icon: (
        <>
          <rect x="4" y="6" width="14" height="12" rx="2" />
          <path d="M7 4h14v12" opacity="0.6" />
          <path d="m4 15 4-3.5 3.5 3 3-2.5 3.5 3" />
        </>
      ),
    },
    {
      href: "/collection/music",
      jp: "ミュージック",
      en: "MUSIC",
      icon: (
        <>
          <circle cx="7" cy="18" r="2.5" />
          <circle cx="17" cy="16" r="2.5" />
          <path d="M9.5 18V7l10-2v11" />
        </>
      ),
    },
    {
      jp: "カード",
      en: "CARD",
      disabled: true,
      note: tr("準備中", "Segera hadir"),
      icon: (
        <>
          <rect x="5" y="4" width="11" height="16" rx="2" />
          <path d="M9 8h3M19 7v13a2 2 0 0 1-2 2h-7" opacity="0.6" />
        </>
      ),
    },
  ];

  return (
    <CollectionShell bandTitle={tr("コレクション", "Koleksi")} counter={4}>
      <div className="space-y-3 max-w-2xl mx-auto w-full">
        {rows.map((r) => {
          const inner = (
            <>
              <span className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-[var(--icon-line)]">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {r.icon}
                </svg>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-base font-bold text-foreground truncate">{r.jp}</span>
                <span className="block text-[11px] font-semibold tracking-wider text-[var(--icon-line)]">
                  {r.en}
                  {r.note ? <span className="ml-2 text-text-dim font-medium">· {r.note}</span> : null}
                </span>
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b9c8f5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m9 5 7 7-7 7" />
              </svg>
            </>
          );
          const cls =
            "w-full flex items-center gap-3 px-4 py-5 rounded-2xl bg-white border border-white shadow-sm transition";
          return r.disabled || !r.href ? (
            <div key={r.jp} className={`${cls} opacity-45 cursor-not-allowed`}>{inner}</div>
          ) : (
            <Link key={r.jp} href={r.href} className={`${cls} hover:shadow-md active:scale-[0.99]`}>
              {inner}
            </Link>
          );
        })}
      </div>
    </CollectionShell>
  );
}
