"use client";

type BottomNavProps = {
  onBack?: () => void;
  onMenu: () => void;
  onHome?: () => void;
  hasNotif?: boolean;
  menuOpen?: boolean;
};

/**
 * BottomNav — bar navigasi bawah ala Linkura.
 * Tombol: kembali (←), menu (☰ dengan notif dot), home (🏠).
 */
export function BottomNav({
  onBack,
  onMenu,
  onHome,
  hasNotif = false,
  menuOpen = false,
}: BottomNavProps) {
  return (
    <nav className="flex items-center justify-around gap-2 px-6 py-2.5 bg-white/90 backdrop-blur-md border-t border-[var(--linkura-border)]">
      <button
        onClick={onBack}
        aria-label="Kembali"
        className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-[var(--linkura-surface-2)] active:scale-95 transition disabled:opacity-30"
        disabled={!onBack}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={onMenu}
        aria-label="Menu"
        aria-expanded={menuOpen}
        className="relative flex items-center justify-center w-11 h-11 rounded-full hover:bg-[var(--linkura-surface-2)] active:scale-95 transition"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
        {hasNotif && (
          <span
            aria-hidden
            className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"
          />
        )}
      </button>

      <button
        onClick={onHome}
        aria-label="Beranda"
        className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-[var(--linkura-surface-2)] active:scale-95 transition disabled:opacity-30"
        disabled={!onHome}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 10 9-7 9 7v11a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
        </svg>
      </button>
    </nav>
  );
}
