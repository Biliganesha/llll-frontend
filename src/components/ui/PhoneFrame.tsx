import { ReactNode } from "react";

/**
 * PhoneShell — kontainer layout Linkura untuk viewport mobile.
 * Tidak dipakai di tablet/desktop (mereka punya layout sendiri).
 */
export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex-1 flex flex-col min-h-screen wallpaper-default overflow-hidden">
      {children}
    </div>
  );
}

// Backwards-compat alias (sementara) — akan dihapus setelah page.tsx direfactor.
export const PhoneFrame = PhoneShell;
