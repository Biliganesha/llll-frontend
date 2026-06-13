"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language";
import { STORY_DIGESTS, type StoryDigest } from "@/data/story-digests";

/**
 * StoryDigestModal — "ほぼ10分でわかる ストーリーダイジェスト" (ref app: docs/LINKURA_UI_KATSUDOU.md).
 * Daftar video digest resmi; klik kartu → putar embed di dalam modal. Tombol 閉じる.
 * Empty-state per kategori bila belum ada (mengikuti pola "○○年度のダイジェストは現在ありません").
 */
export function StoryDigestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState<StoryDigest | null>(null);

  if (!open) return null;

  const units = STORY_DIGESTS.filter((d) => d.category === "unit");
  const arcs = STORY_DIGESTS.filter((d) => d.category === "arc");

  const section = (titleJp: string, titleId: string, items: StoryDigest[]) => (
    <div className="mb-5">
      <h3 className="text-xs font-bold text-text-dim mb-2">{t(titleJp, titleId)}</h3>
      {items.length === 0 ? (
        <p className="text-[11px] text-text-dim py-6 text-center">
          {t("ダイジェストは現在ありません。", "Belum ada ringkasan untuk bagian ini.")}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((d) => (
            <button
              key={d.youtubeVideoId}
              onClick={() => setPlaying(d)}
              className="group relative rounded-xl overflow-hidden border border-border text-left hover:shadow-md transition"
            >
              <div className="relative aspect-video bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${d.youtubeVideoId}/mqdefault.jpg`}
                  alt={d.titleJp}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-11 h-11 rounded-full bg-black/55 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="6,3 20,12 6,21" /></svg>
                  </span>
                </div>
              </div>
              <p className="px-2.5 py-1.5 text-[11px] font-medium leading-snug">{t(d.titleJp, d.labelId)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button aria-hidden tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-black/50 cursor-default" />
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white overflow-hidden shadow-xl">
        {/* Header banner ala app */}
        <div className="px-4 py-3 text-white font-bold text-sm shrink-0" style={{ background: "linear-gradient(135deg,#6a7bff,#a88dff)" }}>
          {t("ほぼ10分でわかる ストーリーダイジェスト", "Ringkasan Cerita ~10 Menit")}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {playing ? (
            <div>
              <div className="relative w-full rounded-xl overflow-hidden border border-border" style={{ aspectRatio: "16 / 9" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${playing.youtubeVideoId}?autoplay=1&rel=0`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={playing.titleJp}
                />
              </div>
              <p className="text-sm font-medium mt-2">{t(playing.titleJp, playing.labelId)}</p>
              <button onClick={() => setPlaying(null)} className="mt-3 text-xs text-primary hover:underline">
                {t("← 一覧に戻る", "← Kembali ke daftar")}
              </button>
            </div>
          ) : (
            <>
              {section("ユニット別", "Per Unit", units)}
              {section("物語の編", "Per Babak Cerita", arcs)}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 shrink-0 border-t border-border">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-surface-2 text-sm font-medium hover:bg-surface-2/70 transition">
            {t("閉じる", "Tutup")}
          </button>
        </div>
      </div>
    </div>
  );
}
