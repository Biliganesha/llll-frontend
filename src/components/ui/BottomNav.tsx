"use client";

type BottomNavProps = {
  onBack?: () => void;
  onMenu: () => void;
  onHome?: () => void;
  hasNotif?: boolean;
  menuOpen?: boolean;
};

/** Satu defs global (id unik) — dirujuk lintas-SVG oleh semua ikon nav. */
function NavGradientDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <defs>
        <linearGradient id="llll-navgrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6fa8f0" />
          <stop offset="100%" stopColor="#9b7df5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * BottomNav — bar navigasi bawah ala app リンクラ (acuan s02/s03):
 * 3 segmen dipisah garis vertikal; ikon gradien biru→ungu; tombol tengah
 * ☰ (dengan dot merah-oranye) berubah menjadi X saat menu terbuka.
 */
export function BottomNav({
  onBack,
  onMenu,
  onHome,
  hasNotif = false,
  menuOpen = false,
}: BottomNavProps) {
  return (
    <nav className="relative z-[80] flex items-stretch bg-white/92 backdrop-blur-md border-t border-white/70 shadow-[0_-2px_10px_rgba(130,120,200,0.12)]">
      <NavGradientDefs />
      <button
        onClick={onBack}
        aria-label="Kembali"
        className="flex-1 flex items-center justify-center py-2.5 active:scale-95 transition disabled:opacity-30"
        disabled={!onBack}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#llll-navgrad)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H8" />
        </svg>
      </button>

      <div aria-hidden className="w-px my-2 bg-[var(--linkura-border)]" />

      <button
        onClick={onMenu}
        aria-label={menuOpen ? "Tutup menu" : "Menu"}
        aria-expanded={menuOpen}
        className="relative flex-1 flex items-center justify-center py-2.5 active:scale-95 transition"
      >
        {menuOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#llll-navgrad)" strokeWidth="2.6" strokeLinecap="round">
              <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#llll-navgrad)" strokeWidth="2.6" strokeLinecap="round">
                  <line x1="4" y1="9" x2="17" y2="9" />
              <line x1="4" y1="15" x2="13" y2="15" />
            </svg>
            {hasNotif && (
              <span
                aria-hidden
                className="absolute top-1.5 left-1/2 translate-x-[5px] w-3 h-3 rounded-full ring-2 ring-white"
                style={{ background: "radial-gradient(circle at 35% 35%, #ff8a6a, #ff6243)" }}
              />
            )}
          </>
        )}
      </button>

      <div aria-hidden className="w-px my-2 bg-[var(--linkura-border)]" />

      <button
        onClick={onHome}
        aria-label="Beranda"
        className="flex-1 flex items-center justify-center py-2.5 active:scale-95 transition disabled:opacity-30"
        disabled={!onHome}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#llll-navgrad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 10 9-7 9 7v11a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
        </svg>
      </button>
    </nav>
  );
}
