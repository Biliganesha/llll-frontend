"use client";

import React from "react";
import { useLanguage } from "@/lib/language";

/**
 * SourcesList — section "出典 / Referensi" bernomor (kebijakan: semua konten wajib rujukan).
 * `raw` = textarea dari CMS, satu sumber per baris, format "Label | URL".
 * Konten dapat memuat token sitasi [1] [2] … yang dirender `withCitations`/`citeHtml`
 * sebagai superscript tertaut ke nomor di daftar ini (anchor #ref-n).
 */
export function SourcesList({ raw, accent }: { raw: string | null | undefined; accent?: string }) {
  const { t } = useLanguage();
  if (!raw?.trim()) return null;

  const items = raw
    .split("\n")
    .map((line) => {
      const [label, url] = line.split("|").map((s) => s.trim());
      return label ? { label, url: url || null } : null;
    })
    .filter((x): x is { label: string; url: string | null } => !!x);
  if (items.length === 0) return null;

  return (
    <div className="mt-6 pt-3 border-t border-border">
      <h2 className="text-xs font-bold mb-1.5 text-text-dim">{t("出典", "Referensi")}</h2>
      <ol className="space-y-0.5">
        {items.map((s, i) => (
          <li key={i} id={`ref-${i + 1}`} className="text-[11px] text-text-dim leading-relaxed scroll-mt-20">
            <span className="tabular-nums">[{i + 1}]</span>{" "}
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:opacity-80" style={accent ? { color: accent } : undefined}>
                {s.label} ↗
              </a>
            ) : (
              s.label
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Teks polos → ReactNode[]; token [n] jadi superscript tertaut ke #ref-n. */
export function withCitations(text: string): React.ReactNode[] {
  return text.split(/(\[\d+\])/g).map((part, i) => {
    const m = part.match(/^\[(\d+)\]$/);
    if (!m) return part;
    return (
      <sup key={i} className="text-[0.72em]">
        <a href={`#ref-${m[1]}`} className="no-underline text-primary hover:underline">[{m[1]}]</a>
      </sup>
    );
  });
}

/** String HTML (wysiwyg) → token [n] jadi anchor superscript (untuk dangerouslySetInnerHTML). */
export function citeHtml(html: string): string {
  return html.replace(/\[(\d+)\]/g, '<sup style="font-size:0.72em"><a href="#ref-$1" style="text-decoration:none;color:var(--linkura-primary,#8b82f5)">[$1]</a></sup>');
}
