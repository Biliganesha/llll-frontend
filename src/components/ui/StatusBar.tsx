"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language";

type StatusBarProps = {
  episodeCount?: number;
  memberName?: string;
  unitLabel?: string;
};

/**
 * StatusBar — meniru anatomi status bar app リンクラ (acuan s02_afterlogin.png):
 * [jam + baterai + tombol ?] · [badge Chapter RANK] · [pill NAME (label halaman)]
 * · [JP/ID (adaptasi web)] · [counter episode sebagai padanan currency].
 */
export function StatusBar({
  episodeCount = 0,
  unitLabel = "アーカイブ",
}: StatusBarProps) {
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
    <div className="relative z-[80] flex items-center gap-1.5 px-2.5 py-1.5 bg-white/85 backdrop-blur-md border-b border-white/60 select-none">
      {/* Jam + baterai (kiri, ala app) */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="tabular-nums text-[13px] font-semibold text-slate-700">
          {time || "--:--"}
        </span>
        <svg width="17" height="11" viewBox="0 0 24 14" aria-hidden className="text-slate-700">
          <rect x="0.8" y="0.8" width="19" height="12.4" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <rect x="3" y="3" width="14.5" height="8" rx="1.6" fill="currentColor" />
          <path d="M21.5 4.5v5c1.4-.3 2.2-1.3 2.2-2.5s-.8-2.2-2.2-2.5z" fill="currentColor" />
          <path d="M11.6 3.4 8.6 7.4h2l-1 3.2 3.2-4.2h-2.1l.9-3z" fill="#fff" stroke="#fff" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Tombol ? (bantuan → About) */}
      <Link
        href="/about"
        aria-label={lang === "jp" ? "ヘルプ・このサイトについて" : "Bantuan / Tentang situs"}
        className="w-5 h-5 shrink-0 rounded-full bg-white shadow-sm border border-[var(--linkura-border)] flex items-center justify-center text-[11px] font-bold text-[var(--icon-line)] active:scale-90 transition"
      >
        ?
      </Link>

      {/* Badge Chapter RANK (dekoratif, ala app) */}
      <div
        aria-hidden
        className="shrink-0 rounded-lg px-1.5 py-0.5 text-center leading-none shadow-sm"
        style={{ background: "linear-gradient(135deg, #67d8fb, #a5a4fd)" }}
      >
        <div className="text-[6px] font-bold text-white/95 tracking-wide">Chapter RANK</div>
        <div className="text-[11px] font-extrabold text-white drop-shadow-sm">✦S✦</div>
      </div>

      {/* Pill NAME — nilai = konteks halaman (padanan pill NAME 蓮ノ空 di app) */}
      <div className="flex-1 min-w-0 flex items-stretch rounded-lg bg-white border border-[#b9c4f5] shadow-sm overflow-hidden">
        <div className="flex-1 min-w-0 px-1.5 py-0.5 leading-none">
          <div className="text-[6px] font-bold text-[#8b96f0] tracking-wider">NAME</div>
          <div className="text-[11px] font-semibold text-slate-800 truncate">{unitLabel}</div>
        </div>
        <div
          aria-hidden
          className="w-4 shrink-0 flex items-center justify-center"
          style={{ background: "linear-gradient(180deg, #9aa8f5, #7d8bf5)" }}
        >
          <svg width="7" height="9" viewBox="0 0 8 10" fill="#fff"><path d="M1 1l6 4-6 4z" /></svg>
        </div>
      </div>

      {/* JP/ID (fungsi web — tidak ada di app, dibuat sekecil mungkin) */}
      <button
        onClick={() => setLang(lang === "jp" ? "id" : "jp")}
        className="shrink-0 rounded-full bg-white/80 border border-[var(--linkura-border)] px-1.5 py-0.5 text-[10px] font-bold text-slate-600 active:scale-95 transition cursor-pointer"
        aria-label="言語切替 / Ganti bahasa"
      >
        {lang === "jp" ? "JP" : "ID"}
      </button>

      {/* Counter episode (padanan currency app) */}
      <div className="shrink-0 flex items-center gap-1">
        <span
          aria-hidden
          className="w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #6fb3f0, #8b82f5)" }}
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
            <polygon points="23 7 16 12 23 17 23 7" fill="#fff" stroke="none" />
            <rect x="1" y="5" width="15" height="14" rx="2" fill="#fff" stroke="none" />
          </svg>
        </span>
        <span className="text-[12px] font-semibold tabular-nums text-slate-700">
          {episodeCount.toLocaleString("ja-JP")}
        </span>
      </div>
    </div>
  );
}
