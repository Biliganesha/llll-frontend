"use client";

import { useState } from "react";
import { LinkuraPlayer } from "@/components/video/LinkuraPlayer";
import { PlayConfirmModal } from "@/components/katsudou/PlayConfirmModal";
import { useLanguage } from "@/lib/language";
import { usePlaybackPrefs, useWatchedParts } from "@/lib/playback";
import type { PartNode } from "@/graphql/fragments/part";

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}分${s > 0 ? `${s}秒` : ""}`;
}

/**
 * PartPlayer — satu kartu PART di 活動記録.
 * Flow ala app: preview (thumbnail + ▶) → pop-up 再生確認 → OK → player + tandai ✓ watched.
 * (ref: docs/LINKURA_UI_KATSUDOU.md → L3 timeline part + 再生確認 + penanda ✓)
 */
export function PartPlayer({
  part,
  accentColor = "#8b82f5",
}: {
  part: PartNode;
  accentColor?: string;
}) {
  const { t, lang } = useLanguage();
  const { prefs, update } = usePlaybackPrefs();
  const { isWatched, markWatched } = useWatchedParts();

  const pd = part.partDetails;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [started, setStarted] = useState(false);

  const watched = isWatched(part.databaseId);
  const partLabel = `Part ${pd.partNumber ?? "-"}`;
  const summary = lang === "jp" ? pd.summaryJp : pd.summaryId || pd.summaryJp;
  const thumb = pd.youtubeVideoId
    ? `https://img.youtube.com/vi/${pd.youtubeVideoId}/hqdefault.jpg`
    : null;
  const portrait = prefs.orientation === "portrait";

  const handleConfirm = () => {
    setConfirmOpen(false);
    setStarted(true);
    markWatched(part.databaseId);
  };

  const watchedLabel = t("視聴済み", "Sudah ditonton");

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      {/* Header: Part N + ✓ watched + durasi */}
      <div className="px-3 py-2 bg-surface-2/50 flex items-center justify-between">
        <span className="text-sm font-bold flex items-center gap-1.5">
          {partLabel}
          {watched && (
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white"
              style={{ background: accentColor }}
              title={watchedLabel}
              aria-label={watchedLabel}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          )}
        </span>
        {pd.durationSeconds ? (
          <span className="text-[11px] text-text-dim">{formatDuration(pd.durationSeconds)}</span>
        ) : null}
      </div>

      {/* Body: preview (gerbang 再生確認) atau player */}
      <div className="p-3">
        <div className={portrait ? "max-w-[420px] mx-auto" : undefined}>
          {started ? (
            <LinkuraPlayer
              videoId={pd.youtubeVideoId || undefined}
              mirrorUrl={pd.mirrorUrl || undefined}
              title={part.title}
              accentColor={accentColor}
              hasSubtitleJp={!!pd.hasSubtitleJp}
              hasSubtitleId={!!pd.hasSubtitleId}
              autoPlay
            />
          ) : (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="relative w-full aspect-video rounded-xl overflow-hidden group bg-black block"
              aria-label={t("再生", "Putar")}
            >
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb}
                  alt={part.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, var(--linkura-surface-2), var(--linkura-border))",
                  }}
                >
                  <span className="text-4xl">📼</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              {watched && (
                <span
                  className="absolute top-2 right-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                  style={{ background: accentColor }}
                >
                  {watchedLabel} ✓
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center">
                <span
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition group-hover:scale-105"
                  style={{ background: accentColor }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <polygon points="7,4 20,12 7,20" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>

        {summary && (
          <p className="text-sm leading-relaxed text-foreground/80 mt-3">{summary}</p>
        )}
      </div>

      <PlayConfirmModal
        open={confirmOpen}
        partLabel={partLabel}
        autoplayNext={prefs.autoplayNext}
        orientation={prefs.orientation}
        onChange={update}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
