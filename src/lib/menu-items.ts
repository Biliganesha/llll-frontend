/**
 * menu-items.ts — sumber tunggal daftar menu untuk Menu Launcher.
 * Dikonsumsi oleh MenuOverlay (launcher) di semua viewport (phone/tablet/desktop)
 * dan NavBar (dropdown grup) supaya isi menu konsisten di mana pun.
 * Label bilingual (JP/ID) — launcher menampilkan satu bahasa sesuai toggle.
 */

export type MenuLink = {
  href: string;
  /** Label utama (JP) */
  label: string;
  /** Label Indonesia */
  labelId: string;
  /** Sub-label (EN) untuk tampilan launchpad */
  sub: string;
  emoji: string;
  gradient: string;
  /** Belum tersedia (grayed out) */
  disabled?: boolean;
};

export type MenuGroup = {
  key: string;
  label: string;
  labelId: string;
  sub: string;
  emoji: string;
  gradient: string;
  items: MenuLink[];
};

/** Item utama yang tampil sebagai ikon tunggal di launcher. */
export const MENU_LINKS: MenuLink[] = [
  {
    href: "/sukukone",
    label: "スクコネ",
    labelId: "SukuKone",
    sub: "School Idol Connect",
    emoji: "🎤",
    gradient: "linear-gradient(135deg, #6a7bff 0%, #a88dff 100%)",
  },
  {
    href: "/katsudou-kiroku",
    label: "活動記録",
    labelId: "Catatan Aktivitas",
    sub: "Episode Story",
    emoji: "📖",
    gradient: "linear-gradient(135deg, #ffb3d9 0%, #b3d4ff 100%)",
  },
  {
    href: "/calendar",
    label: "カレンダー",
    labelId: "Kalender",
    sub: "Calendar",
    emoji: "📅",
    gradient: "linear-gradient(135deg, #9ee6ff 0%, #a5aeff 100%)",
  },
  {
    href: "/collection",
    label: "コレクション",
    labelId: "Koleksi",
    sub: "Collection",
    emoji: "🖼️",
    gradient: "linear-gradient(135deg, #ffd6a5 0%, #fca5d8 100%)",
  },
  {
    href: "/timeline",
    label: "タイムライン",
    labelId: "Garis Waktu",
    sub: "Timeline",
    emoji: "🕰️",
    gradient: "linear-gradient(135deg, #b3e5ff 0%, #c9a5ff 100%)",
  },
  {
    href: "/gameplay",
    label: "ゲームプレイ",
    labelId: "Gameplay",
    sub: "Gameplay Archive",
    emoji: "🎮",
    gradient: "linear-gradient(135deg, #fca5a5 0%, #f472b6 100%)",
  },
  {
    href: "/search",
    label: "検索",
    labelId: "Cari",
    sub: "Search",
    emoji: "🔍",
    gradient: "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)",
  },
  {
    href: "/community",
    label: "フォーラム",
    labelId: "Forum",
    sub: "Community",
    emoji: "💬",
    gradient: "linear-gradient(135deg, #a5f3fc 0%, #7dd3fc 100%)",
    disabled: true,
  },
  {
    href: "/about",
    label: "このサイトについて",
    labelId: "Tentang Situs",
    sub: "About",
    emoji: "ℹ️",
    gradient: "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)",
  },
];

/**
 * Grup メンバー (poin 16) — メンバー / ユニット / 相関図 disatukan di bawah satu entri.
 * Di launcher tampil sebagai satu ikon yang bila ditekan memperlihatkan 3 sub-item.
 * Di NavBar tampil sebagai satu dropdown.
 */
export const MEMBERS_GROUP: MenuGroup = {
  key: "members",
  label: "メンバー",
  labelId: "Anggota",
  sub: "Members & Units",
  emoji: "🎀",
  gradient: "linear-gradient(135deg, #ffd59e 0%, #ffb3c1 100%)",
  items: [
    {
      href: "/characters",
      label: "メンバー一覧",
      labelId: "Daftar Anggota",
      sub: "Members",
      emoji: "🎀",
      gradient: "linear-gradient(135deg, #ffd59e 0%, #ffb3c1 100%)",
    },
    {
      href: "/units",
      label: "ユニット",
      labelId: "Unit",
      sub: "Units",
      emoji: "💫",
      gradient: "linear-gradient(135deg, #c9b3ff 0%, #ffb3d9 100%)",
    },
    {
      href: "/seiyuu",
      label: "声優",
      labelId: "Seiyuu",
      sub: "Voice Actors",
      emoji: "🎤",
      gradient: "linear-gradient(135deg, #ffb3c1 0%, #c9b3ff 100%)",
    },
    {
      href: "/relationships",
      label: "相関図",
      labelId: "Peta Relasi",
      sub: "Relationships",
      emoji: "🔗",
      gradient: "linear-gradient(135deg, #b3e5ff 0%, #c9a5ff 100%)",
    },
  ],
};

/**
 * Urutan tampil di launcher: 2 item pertama (スクコネ, 活動記録), lalu カレンダー,
 * lalu grup メンバー, lalu sisanya. Helper ini mengembalikan urutan ikon final
 * dengan menyisipkan penanda grup pada posisi yang tepat.
 */
export const MEMBERS_GROUP_POSITION = 3;
