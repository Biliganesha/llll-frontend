"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CollectionShell } from "@/components/collection/CollectionShell";
import { useManifest, imgUrl } from "@/lib/collection";
import { useTr } from "@/lib/language";

const CATS = [
  { key: "ippan", jp: "一般" },
  { key: "sukusute", jp: "スクステ" },
  { key: "tokubetsu", jp: "特別" },
  { key: "sonota", jp: "その他" },
] as const;

const STEP = 60;

/**
 * ステッカー — meniru binder app (acuan s05_sticker_top.png): halaman putih
 * berpola polkadot pink + spiral kiri + tab samping vertikal (一般/スクステ/
 * 特別/その他, aktif pink) + toggle リスト/アイコン mengambang. 5.265 stiker
 * dimuat berjendela (60/langkah, sentinel IntersectionObserver).
 */
export default function StickerPage() {
  const tr = useTr();
  const { data, error } = useManifest("sticker");
  const [cat, setCat] = useState<(typeof CATS)[number]["key"]>("ippan");
  const [mode, setMode] = useState<"list" | "icon">("list");
  const [shown, setShown] = useState(STEP);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () => (data?.items ?? []).filter((i) => (i.cat ?? "sonota") === cat),
    [data, cat]
  );
  const visible = items.slice(0, shown);

  useEffect(() => setShown(STEP), [cat, mode]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (es) => es.some((e) => e.isIntersecting) && setShown((n) => Math.min(n + STEP, items.length)),
      { rootMargin: "600px" }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [items.length]);

  return (
    <CollectionShell bandTitle={tr("ステッカー", "Stiker")} counter={data?.count ?? 0}>
      {error ? (
        <p className="py-12 text-center text-sm text-red-500">{error}</p>
      ) : !data ? (
        <p className="py-12 text-center text-sm text-text-dim animate-pulse">Now Loading...</p>
      ) : (
        <div className="relative max-w-2xl mx-auto w-full">
          {/* Binder */}
          <div
            className="relative rounded-3xl border border-white shadow-md overflow-hidden mr-9"
            style={{
              background:
                "radial-gradient(circle at 12px 12px, rgba(255,182,213,0.35) 5px, transparent 6px) 0 0 / 56px 56px, radial-gradient(circle at 40px 40px, rgba(255,182,213,0.22) 8px, transparent 9px) 0 0 / 56px 56px, #ffffff",
            }}
          >
            {/* Spiral binder kiri */}
            <div aria-hidden className="absolute left-1.5 top-0 bottom-0 w-4 flex flex-col justify-evenly">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="w-4 h-2 rounded-full bg-[#c9c2f5] shadow-inner" />
              ))}
            </div>

            <p className="pt-3 text-center text-sm font-bold text-slate-500">
              {CATS.find((c) => c.key === cat)?.jp}
            </p>

            <div className="pl-9 pr-3 py-3">
              {visible.length === 0 ? (
                <p className="py-10 text-center text-xs text-text-dim">
                  {tr("このカテゴリーのステッカーはありません。", "Tidak ada stiker di kategori ini.")}
                </p>
              ) : mode === "list" ? (
                <div className="space-y-3">
                  {visible.map((it) => (
                    <div key={it.id} className="rounded-lg bg-white/80 shadow-sm overflow-hidden">
                      <div
                        className="px-3 py-1.5 flex items-center justify-between gap-2"
                        style={{ background: "linear-gradient(90deg, #8d8df2, #9f97f5)" }}
                      >
                        <span className="text-[13px] font-bold text-white truncate">
                          {it.name ?? `#${it.id}`}
                        </span>
                      </div>
                      <div className="p-2.5 flex gap-3 items-start">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl(data, it.f)}
                          alt={it.name ?? it.id}
                          width={88}
                          height={Math.round((88 * it.h) / it.w) || 88}
                          loading="lazy"
                          decoding="async"
                          className="w-[88px] shrink-0 rounded bg-surface-2/60"
                        />
                        {it.desc ? (
                          <p className="text-[12px] leading-relaxed text-foreground/80">{it.desc}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {visible.map((it) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={it.id}
                      src={imgUrl(data, it.f)}
                      alt={it.name ?? it.id}
                      title={it.name ?? it.id}
                      width={it.w}
                      height={it.h}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto rounded bg-white/70 shadow-sm"
                    />
                  ))}
                </div>
              )}
              <div ref={sentinelRef} />
              {shown < items.length && (
                <p className="py-3 text-center text-[11px] text-text-dim">
                  {shown} / {items.length}
                </p>
              )}
            </div>
          </div>

          {/* Tab samping vertikal */}
          <div className="absolute right-0 top-8 flex flex-col gap-1.5">
            {CATS.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`w-9 py-3 rounded-r-xl text-[12px] font-bold shadow-sm transition cursor-pointer ${
                  cat === c.key ? "bg-[#f7b8d4] text-white" : "bg-white text-slate-500 hover:bg-surface-2"
                }`}
                style={{ writingMode: "vertical-rl" }}
              >
                {c.jp}
              </button>
            ))}
          </div>

          {/* Toggle リスト/アイコン */}
          <div className="sticky bottom-2 lg:bottom-20 mt-3 flex justify-end pr-12">
            <div className="flex rounded-full bg-white shadow-lg border border-[var(--linkura-border)] overflow-hidden">
              {(
                [
                  { m: "list", label: tr("リスト", "Daftar"), icon: <path d="M4 6h12M4 12h12M4 18h12" /> },
                  { m: "icon", label: tr("アイコン", "Ikon"), icon: <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></> },
                ] as const
              ).map((o) => (
                <button
                  key={o.m}
                  onClick={() => setMode(o.m)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-bold transition cursor-pointer ${
                    mode === o.m ? "text-white" : "text-slate-500"
                  }`}
                  style={mode === o.m ? { background: "linear-gradient(90deg, #8d8df2, #a89bf5)" } : undefined}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    {o.icon}
                  </svg>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </CollectionShell>
  );
}
