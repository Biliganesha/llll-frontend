import type { ReactNode } from "react";

/**
 * MENU_ICONS — ikon line-art (stroke biru ala app リンクラ) per href.
 * Sumber tunggal: dipakai MenuOverlay (grid launcher) DAN DockMembersButton
 * (submenu メンバー di dock) supaya ikon fitur yang sama tak pernah beda rupa.
 */
export const MENU_ICONS: Record<string, ReactNode> = {
  "/calendar": (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  ),
  "/collection": (
    <>
      <rect x="3" y="7" width="13" height="13" rx="2" />
      <path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
      <path d="m3 16 3.5-3 3 2.5 2.5-2 4 3.5" />
    </>
  ),
  "/timeline": (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9 2h6" />
    </>
  ),
  "/gameplay": (
    <>
      <path d="M6 9h.01M17 10h.01M14.5 8h.01" />
      <path d="M7.2 6h9.6a4.8 4.8 0 0 1 4.7 4l.9 5.2a2.6 2.6 0 0 1-4.6 2.1L16 15H8l-1.8 2.3a2.6 2.6 0 0 1-4.6-2.1L2.5 10a4.8 4.8 0 0 1 4.7-4z" />
      <path d="M9 8v4M7 10h4" />
    </>
  ),
  "/search": (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  "/community": (
    <>
      <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z" />
      <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
    </>
  ),
  "/about": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v5h1" />
    </>
  ),
  "/characters": (
    <>
      <path d="M12 3c2 2.5 6 3 6 7 0 3-2.5 5-6 5s-6-2-6-5c0-4 4-4.5 6-7z" />
      <path d="M8 20c1.2-1.5 6.8-1.5 8 0" />
    </>
  ),
  "/units": (
    <>
      <circle cx="8" cy="9" r="4" />
      <circle cx="16" cy="9" r="4" />
      <path d="M4 20c.8-3 7.2-3 8 0M12 20c.8-3 7.2-3 8 0" />
    </>
  ),
  "/seiyuu": (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  "/relationships": (
    <>
      <circle cx="5" cy="6" r="2.5" />
      <circle cx="19" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M7 7.5 10.5 16M17 7.5 13.5 16M7.5 6h9" />
    </>
  ),
};
