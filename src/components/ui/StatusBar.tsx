"use client";

import { useEffect, useState } from "react";

type StatusBarProps = {
  episodeCount?: number;
  memberName?: string;
  unitLabel?: string;
};

/**
 * StatusBar — meniru status bar aplikasi Linkura.
 * Format: [jam] · [avatar + unit/member label] · [episode counter sebagai pengganti currency].
 */
export function StatusBar({
  episodeCount = 0,
  memberName = "蓮ノ空",
  unitLabel = "アーカイブ",
}: StatusBarProps) {
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
    <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-md border-b border-white/60 select-none">
      <div className="tabular-nums text-sm font-semibold text-slate-700">
        {time || "--:--"}
      </div>

      <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b3d4ff] via-[#c9b3ff] to-[#ffb3d9] px-2 py-0.5 shadow-sm">
        <div className="w-5 h-5 rounded-full bg-white/70 border border-white flex items-center justify-center text-[9px]">
          🌸
        </div>
        <span className="text-[11px] font-medium text-slate-800 truncate max-w-[80px]">
          {unitLabel}
        </span>
      </div>

      <div className="flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
        <span className="text-[11px] font-semibold tabular-nums text-slate-700">
          {episodeCount.toLocaleString("ja-JP")}
        </span>
      </div>
    </div>
  );
}
