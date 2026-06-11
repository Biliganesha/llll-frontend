/**
 * unit-colors.ts — warna tampilan aman untuk unit dengan warna resmi sangat terang
 * (Edel Note = putih #FFFFFF, warna penlight resminya). Warna asli tetap dihormati
 * sebagai identitas, tapi gradien/teks memakai turunan yang terbaca.
 */

function luminance(hex: string): number {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const n = parseInt(full, 16);
  if (Number.isNaN(n) || full.length !== 6) return 0.5;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export type UnitDisplayColors = {
  color: string;    // warna resmi (untuk badge/identitas)
  accent: string;   // teks aksen di atas latar putih (tagline, heading, link)
  gradFrom: string; // gradien hero
  gradTo: string;
  overlay: string;  // overlay bawah hero (di belakang judul putih)
  isLight: boolean;
};

export function unitDisplayColors(primary?: string | null, secondary?: string | null): UnitDisplayColors {
  const color = primary || "#8b82f5";
  const isLight = luminance(color) > 0.82;
  if (!isLight) {
    return {
      color,
      accent: color,
      gradFrom: color,
      gradTo: secondary || color,
      overlay: `${color}cc`,
      isLight,
    };
  }
  // warna terang (putih/silver): gradien perak + aksen slate supaya teks terbaca
  return {
    color,
    accent: "#64748b",
    gradFrom: "#e2e5ea",
    gradTo: "#94a0b3",
    overlay: "#64748bcc",
    isLight,
  };
}

const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

/** "2023-03-29T00:00:00+00:00" → JP: 2023年3月29日 / ID: 29 Maret 2023 */
export function formatDateLang(iso: string | null | undefined, lang: "jp" | "id"): string | null {
  if (!iso) return null;
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  const [, y, mo, d] = m;
  return lang === "jp"
    ? `${y}年${parseInt(mo)}月${parseInt(d)}日`
    : `${parseInt(d)} ${MONTHS_ID[parseInt(mo) - 1]} ${y}`;
}
