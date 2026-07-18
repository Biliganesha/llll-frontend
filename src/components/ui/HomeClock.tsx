"use client";

import { useEffect, useState } from "react";

const DAY_EN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

/**
 * HomeClock — jam besar putih translusen di wallpaper home (ala app リンクラ).
 * Dipakai TabletHome/DesktopHome (tengah layar); PhoneHome punya varian stacked
 * sendiri mengikuti komposisi layar app portrait.
 */
export function HomeClock({
  className,
  size = "text-[84px]",
}: {
  className?: string;
  size?: string;
}) {
  const [clock, setClock] = useState<{ time: string; date: string } | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock({
        time: `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
        date: `${(now.getMonth() + 1).toString().padStart(2, "0")}/${now
          .getDate()
          .toString()
          .padStart(2, "0")}  ${DAY_EN[now.getDay()]}`,
      });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  if (!clock) return null;

  return (
    <div className={`home-clock ${className ?? ""}`} aria-hidden>
      <div className={`${size} font-light tabular-nums`}>{clock.time}</div>
      <div className="text-base font-medium tracking-[0.25em] mt-3">{clock.date}</div>
    </div>
  );
}
