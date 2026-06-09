"use client";

import { useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { NotificationBar } from "@/components/ui/NotificationBar";

type Props = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

/**
 * Phone layout — Linkura smartphone UI.
 * Widget 今日の蓮ノ空 diakses via notification bar di atas (tap pull handle).
 */
export function PhoneHome({ menuOpen, setMenuOpen }: Props) {
  const router = useRouter();

  return (
    <div className="relative flex-1 flex flex-col min-h-screen wallpaper-default overflow-hidden">
      <StatusBar episodeCount={0} unitLabel="アーカイブ" />

      <NotificationBar />

      <main className="relative flex-1 px-3 pt-3 pb-3 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold brand-gradient-text leading-tight">
              Link! Like!<br />Library! Legacy!
            </h1>
            <p className="text-[11px] text-[var(--linkura-text-dim)] mt-2 tracking-wider">
              蓮ノ空アーカイブ
            </p>
          </div>
        </div>

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
