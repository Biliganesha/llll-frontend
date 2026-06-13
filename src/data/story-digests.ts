/**
 * story-digests.ts — daftar video "ほぼ10分でわかる ストーリーダイジェスト" resmi (@lovelive_hasu).
 * Referensi tetap (set kecil video resmi), jadi disimpan sebagai data statis frontend —
 * bukan konten yang di-maintain user via WP admin. Dilengkapi/diverifikasi via agen
 * (oEmbed @lovelive_hasu). Lihat docs/LINKURA_UI_KATSUDOU.md (Story Digest per-tahun).
 */
export type StoryDigest = {
  titleJp: string;
  labelId: string;
  category: "unit" | "arc";
  /** Tahun/angkatan (年度), mis. "103期" / "2023" — null bila belum dipastikan (jangan mengarang). */
  year?: string | null;
  youtubeVideoId: string;
};

// Semua terverifikasi oEmbed @lovelive_hasu (Lane 1, 2026-06-13). Edel Note tidak punya digest.
export const STORY_DIGESTS: StoryDigest[] = [
  // ── per Unit ──
  { titleJp: "ほぼ10分でわかる 〜スリーズブーケ〜", labelId: "Ringkasan ~Cerise Bouquet~", category: "unit", youtubeVideoId: "L3Xy14-Djnw" },
  { titleJp: "ほぼ10分でわかる 〜DOLLCHESTRA〜", labelId: "Ringkasan ~DOLLCHESTRA~", category: "unit", youtubeVideoId: "VgvfM60lvUY" },
  { titleJp: "ほぼ10分でわかる 〜みらくらぱーく！〜", labelId: "Ringkasan ~Mira-Cra Park!~", category: "unit", youtubeVideoId: "SFZ_Wk_VVbI" },
  // ── per Babak cerita (編) ──
  { titleJp: "ほぼ10分じゃおさまらない！ 〜102期卒業編〜", labelId: "Ringkasan ~Kelulusan Angkatan 102~", category: "arc", year: "102期", youtubeVideoId: "rxlX9xvLMG8" },
  { titleJp: "ほぼ10分でわかる 〜103期LoveLive!編〜", labelId: "Ringkasan ~Love Live! Angkatan 103~", category: "arc", year: "103期", youtubeVideoId: "JxkegVbRVd4" },
  { titleJp: "ほぼ10分でわかる 〜沙知先輩卒業編〜", labelId: "Ringkasan ~Kelulusan Senpai Sachi~", category: "arc", youtubeVideoId: "iRiy4K8sW5E" },
  { titleJp: "ほぼ10分でわかる 〜To Be Continued LoveLive! 決勝大会編〜", labelId: "Ringkasan ~To Be Continued: Final Love Live!~", category: "arc", youtubeVideoId: "9qy5_gpnTTk" },
  { titleJp: "ほぼ10分でわかる 〜104期新入生編〜", labelId: "Ringkasan ~Murid Baru Angkatan 104~", category: "arc", year: "104期", youtubeVideoId: "i7aQYpIaFIg" },
];
