"use client";

import React, { useEffect } from "react";
import { useLanguage } from "@/lib/language";

/**
 * SourcesList — section "出典 / Referensi" bernomor (kebijakan: semua konten wajib rujukan).
 * `raw` = textarea dari CMS, satu sumber per baris, format "Label | URL".
 * Konten dapat memuat token sitasi [1] [2] … yang dirender `withCitations`/`citeHtml`.
 *
 * Catatan scroll: 3 layout (phone/tablet/desktop) dirender bersamaan di DOM, jadi anchor #ref-n
 * ganda dan lompatan bawaan browser menuju salinan yang tersembunyi. Klik sitasi ditangani
 * delegated handler: cari <li data-ref> yang TERLIHAT lalu smooth-scroll + kilatan sorot.
 */
export function SourcesList({ raw, accent }: { raw: string | null | undefined; accent?: string }) {
  const { t } = useLanguage();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[data-cite]") as HTMLAnchorElement | null;
      if (!a) return;
      e.preventDefault();
      const n = a.getAttribute("data-cite");
      const target = [...document.querySelectorAll<HTMLElement>(`li[data-ref="${n}"]`)]
        .find((el) => el.offsetParent !== null);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.style.transition = "background-color 0.4s";
      target.style.backgroundColor = "rgba(139,130,245,0.18)";
      setTimeout(() => { target.style.backgroundColor = ""; }, 1600);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

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
          <li key={i} data-ref={i + 1} className="text-[11px] text-text-dim leading-relaxed rounded px-1 -mx-1">
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

/** Teks polos → ReactNode[]; token [n] jadi superscript yang menggulir ke referensi terlihat. */
export function withCitations(text: string): React.ReactNode[] {
  return text.split(/(\[\d+\])/g).map((part, i) => {
    const m = part.match(/^\[(\d+)\]$/);
    if (!m) return part;
    return (
      <sup key={i} className="text-[0.72em]">
        <a href={`#ref-${m[1]}`} data-cite={m[1]} className="no-underline text-primary hover:underline">[{m[1]}]</a>
      </sup>
    );
  });
}

/** String HTML (wysiwyg) → token [n] jadi anchor superscript (untuk dangerouslySetInnerHTML). */
export function citeHtml(html: string): string {
  return html.replace(/\[(\d+)\]/g, '<sup style="font-size:0.72em"><a href="#ref-$1" data-cite="$1" style="text-decoration:none;color:var(--linkura-primary,#8b82f5)">[$1]</a></sup>');
}
