"use client";

import { useEffect, useState } from "react";

type MiniEntry = {
  id: string;
  year: number;
  type: "with-meets" | "fes-live" | "with-station" | "katsudou-kiroku";
  title: string;
};

const MOCK_MINI: MiniEntry[] = [
  { id: "m1", year: 2024, type: "fes-live", title: "Fes×LIVE #12 — 桜舞う月" },
  { id: "m2", year: 2025, type: "with-meets", title: "With×MEETS 新学期SP" },
];

type NostalgiaMiniProps = {
  onExpand?: () => void;
};

/**
 * NostalgiaMini — widget kompak di pojok Home.
 * Menampilkan teaser singkat "Hari ini di 蓮の空". Tap untuk buka detail di Menu.
 */
export function NostalgiaMini({ onExpand }: NostalgiaMiniProps) {
  const [dateLabel, setDateLabel] = useState<string>("");

  useEffect(() => {
    const d = new Date();
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const dd = d.getDate().toString().padStart(2, "0");
    setDateLabel(`${mm}/${dd}`);
  }, []);

  const teaser = MOCK_MINI[0];

  return (
    <button
      onClick={onExpand}
      className="group block text-left w-full max-w-[260px] rounded-2xl bg-white/75 backdrop-blur-md border border-white/80 px-3 py-2.5 shadow-lg hover:bg-white/90 active:scale-[0.98] transition"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px]" aria-hidden>🌸</span>
          <span className="text-[10px] font-semibold text-[var(--linkura-primary)] tracking-wide">
            今日の蓮の空
          </span>
        </div>
        <span className="text-[9px] text-[var(--linkura-text-dim)] tabular-nums">
          {dateLabel}
        </span>
      </div>
      <p className="text-[11px] text-[var(--linkura-text)] leading-snug line-clamp-2">
        <span className="font-semibold text-[var(--linkura-primary)]">{teaser.year}</span>
        {" — "}
        {teaser.title}
      </p>
      <div className="mt-1 text-[9px] text-[var(--linkura-text-dim)] group-hover:text-[var(--linkura-primary)] transition">
        タップで詳細 →
      </div>
    </button>
  );
}
