"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { NostalgiaMini } from "@/components/calendar/NostalgiaMini";
import { NotificationBar } from "@/components/ui/NotificationBar";

type Props = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

type WidgetVariant = "a" | "b" | "c";

const VARIANT_LABELS: Record<WidgetVariant, string> = {
  a: "A: Notif bar",
  b: "B: Menu saja",
  c: "C: Mini + Menu",
};

/**
 * Phone layout — Linkura smartphone UI.
 * Sample toggle A/B/C untuk widget 今日の蓮の空:
 *  A = Notification bar (swipe down dari atas)
 *  B = Hanya di menu panel (Home polos)
 *  C = Mini widget di Home + detail di menu (default)
 */
export function PhoneHome({ menuOpen, setMenuOpen }: Props) {
  const router = useRouter();
  const [variant, setVariant] = useState<WidgetVariant>("c");

  return (
    <div className="relative flex-1 flex flex-col min-h-screen wallpaper-default overflow-hidden">
      <StatusBar episodeCount={0} unitLabel="アーカイブ" />

      {variant === "a" && <NotificationBar />}

      <main className="relative flex-1 px-3 pt-3 pb-3 flex flex-col">
        {variant === "c" && (
          <NostalgiaMini onExpand={() => setMenuOpen(true)} />
        )}

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold brand-gradient-text leading-tight">
              Link! Like!<br />Library! Legacy!
            </h1>
            <p className="text-[11px] text-[var(--linkura-text-dim)] mt-2 tracking-wider">
              蓮の空アーカイブ
            </p>
          </div>
        </div>

        <SampleToggle current={variant} onChange={setVariant} />

        <p className="text-center text-[9px] text-[var(--linkura-text-dim)]/70 pt-2 pb-1">
          Fan-made non-profit · © Bandai Namco / ODD No.
        </p>
      </main>

      <BottomNav
        onMenu={() => setMenuOpen(!menuOpen)}
        onHome={() => router.push("/")}
        hasNotif
        menuOpen={menuOpen}
      />

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

function SampleToggle({
  current,
  onChange,
}: {
  current: WidgetVariant;
  onChange: (v: WidgetVariant) => void;
}) {
  return (
    <div className="mt-2 flex flex-col items-center gap-1">
      <span className="text-[9px] text-[var(--linkura-text-dim)] uppercase tracking-wider">
        Widget sample
      </span>
      <div className="flex gap-1 bg-white/60 backdrop-blur rounded-full p-1 border border-white/80 shadow-sm">
        {(Object.keys(VARIANT_LABELS) as WidgetVariant[]).map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition ${
              current === v
                ? "bg-[var(--linkura-primary)] text-white shadow"
                : "text-[var(--linkura-text-dim)] hover:text-[var(--linkura-primary)]"
            }`}
          >
            {VARIANT_LABELS[v]}
          </button>
        ))}
      </div>
    </div>
  );
}
