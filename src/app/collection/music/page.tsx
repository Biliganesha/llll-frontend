"use client";

import { useMemo, useState } from "react";
import { CollectionShell } from "@/components/collection/CollectionShell";
import { useManifest, imgUrl, lyricUrl } from "@/lib/collection";
import { useTr } from "@/lib/language";

/**
 * ミュージック — grid cover 3 kolom (acuan collection_music.png): jacket lagu
 * (image_music_thumbnail) + tab リリックビデオ (lyric_video_thumbnail; item
 * manifest ber-cat "lyric").
 */
export default function MusicPage() {
  const tr = useTr();
  const { data, error } = useManifest("music");
  const [tab, setTab] = useState<"jacket" | "lyric">("jacket");

  const items = useMemo(
    () => (data?.items ?? []).filter((i) => (tab === "lyric" ? !!i.lyric : true)),
    [data, tab]
  );

  return (
    <CollectionShell bandTitle={tr("ミュージック", "Musik")} counter={data?.count ?? 0}>
      {error ? (
        <p className="py-12 text-center text-sm text-red-500">{error}</p>
      ) : !data ? (
        <p className="py-12 text-center text-sm text-text-dim animate-pulse">Now Loading...</p>
      ) : (
        <>
          <div className="mb-3 flex gap-2">
            {(
              [
                { k: "jacket", label: tr("ジャケット", "Sampul") },
                { k: "lyric", label: tr("リリックビデオ", "Video Lirik") },
              ] as const
            ).map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  tab === t.k ? "text-white shadow-sm" : "bg-white text-slate-500 border border-[var(--linkura-border)]"
                }`}
                style={tab === t.k ? { background: "linear-gradient(90deg, #8d8df2, #a89bf5)" } : undefined}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {items.map((it) => (
              <figure key={it.id} className="rounded-lg overflow-hidden bg-white border border-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tab === "lyric" && it.lyric ? lyricUrl(data, it.lyric) : imgUrl(data, it.f)}
                  alt={it.name ?? it.id}
                  title={it.name ?? it.id}
                  width={it.w}
                  height={it.h}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto bg-surface-2/60"
                />
                <figcaption className="px-1.5 py-1.5 text-[10px] font-semibold leading-tight line-clamp-2">
                  {it.name ?? `#${it.id}`}
                </figcaption>
              </figure>
            ))}
          </div>
          {items.length === 0 && (
            <p className="py-10 text-center text-xs text-text-dim">
              {tr("このタブのコンテンツはありません。", "Belum ada konten di tab ini.")}
            </p>
          )}
        </>
      )}
    </CollectionShell>
  );
}
