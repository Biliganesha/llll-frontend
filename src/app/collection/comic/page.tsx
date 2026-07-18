"use client";

import { useEffect, useState } from "react";
import { CollectionShell } from "@/components/collection/CollectionShell";
import { useManifest, imgUrl, thumbUrl } from "@/lib/collection";
import { useTr } from "@/lib/language";

/**
 * りんく！らいふ！ラブライブ！ (コミック/ギャラリー) — grid thumbnail 197 strip
 * 4-koma resmi; tap → lightbox strip penuh 580×1920 (scroll) + navigasi ←/→.
 */
export default function ComicPage() {
  const tr = useTr();
  const { data, error } = useManifest("comic");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const items = data?.items ?? [];

  // navigasi keyboard lightbox
  useEffect(() => {
    if (openIdx === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((i) => (i === null ? i : Math.min(i + 1, items.length - 1)));
      if (e.key === "ArrowLeft") setOpenIdx((i) => (i === null ? i : Math.max(i - 1, 0)));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [openIdx, items.length]);

  const open = openIdx !== null ? items[openIdx] : null;

  return (
    <CollectionShell bandTitle="りんく！らいふ！ラブライブ！" counter={data?.count ?? 0}>
      {error ? (
        <p className="py-12 text-center text-sm text-red-500">{error}</p>
      ) : !data ? (
        <p className="py-12 text-center text-sm text-text-dim animate-pulse">Now Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((it, i) => (
            <button
              key={it.id}
              onClick={() => setOpenIdx(i)}
              className="group text-left rounded-xl overflow-hidden bg-white border border-white shadow-sm hover:shadow-md active:scale-[0.98] transition cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.thumb ? thumbUrl(data, it.thumb) : imgUrl(data, it.f)}
                alt={it.name ?? it.id}
                width={300}
                height={220}
                loading="lazy"
                decoding="async"
                className="w-full h-auto bg-surface-2/60"
              />
              <p className="px-2.5 py-2 text-[11px] font-semibold leading-tight line-clamp-2">
                {it.name ?? `#${it.id}`}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox strip penuh */}
      {data && open && (
        <div
          className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-sm flex flex-col"
          onClick={() => setOpenIdx(null)}
        >
          <div className="flex items-center justify-between px-4 py-2.5 text-white shrink-0">
            <p className="text-sm font-bold truncate">{open.name ?? `#${open.id}`}</p>
            <button
              onClick={() => setOpenIdx(null)}
              aria-label={tr("閉じる", "Tutup")}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center active:scale-90 transition cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-4" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl(data, open.f)}
              alt={open.name ?? open.id}
              width={open.w}
              height={open.h}
              className="mx-auto w-auto max-w-full rounded-lg"
            />
          </div>
          <div
            className="shrink-0 flex items-center justify-center gap-6 pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              disabled={openIdx === 0}
              onClick={() => setOpenIdx((i) => Math.max((i ?? 0) - 1, 0))}
              className="px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-bold disabled:opacity-30 hover:bg-white/35 active:scale-95 transition cursor-pointer"
            >
              ←
            </button>
            <span className="text-white/80 text-xs tabular-nums">
              {(openIdx ?? 0) + 1} / {items.length}
            </span>
            <button
              disabled={openIdx === items.length - 1}
              onClick={() => setOpenIdx((i) => Math.min((i ?? 0) + 1, items.length - 1))}
              className="px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-bold disabled:opacity-30 hover:bg-white/35 active:scale-95 transition cursor-pointer"
            >
              →
            </button>
          </div>
        </div>
      )}
    </CollectionShell>
  );
}
