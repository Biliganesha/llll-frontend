"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useLanguage } from "@/lib/language";
import { CHAPTER_FIELDS, type ChapterNode } from "@/graphql/fragments/chapter";

const GET_CHAPTERS = gql`
  ${CHAPTER_FIELDS}
  query GetChapters {
    storyChapters(first: 50) {
      nodes {
        ...ChapterFields
      }
    }
  }
`;

type QueryData = { storyChapters: { nodes: ChapterNode[] } };

function sortChapters(nodes: ChapterNode[]): ChapterNode[] {
  return [...nodes].sort(
    (a, b) => (a.chapterDetails.sortOrder ?? 0) - (b.chapterDetails.sortOrder ?? 0)
  );
}

export default function KatsudouKirokuPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang } = useLanguage();
  const tr = (jp: string, id: string) => (lang === "jp" ? jp : id);
  const { data, loading, error } = useQuery<QueryData>(GET_CHAPTERS);

  const chapters = sortChapters(data?.storyChapters?.nodes ?? []);

  const body = (
    <div className="space-y-5">
      {loading ? (
        <ChapterSkeleton />
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          <p className="font-medium">{tr("データ取得エラー", "Gagal mengambil data")}</p>
          <p className="mt-1 text-xs opacity-70">{error.message}</p>
        </div>
      ) : chapters.length === 0 ? (
        <div className="py-16 text-center text-text-dim text-sm">
          {tr("章はまだ登録されていません。", "Belum ada bab yang terdaftar.")}
        </div>
      ) : (
        chapters.map((ch) => <ChapterCard key={ch.databaseId} chapter={ch} />)
      )}
    </div>
  );

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={chapters.length} unitLabel={tr("活動記録", "Catatan Aktivitas")} />
        <header className="px-3 pt-3 pb-1">
          <h1 className="text-lg font-bold brand-gradient-text">{tr("活動記録", "Catatan Aktivitas")}</h1>
          <p className="text-[11px] text-text-dim">{tr("蓮ノ空の物語 — 章で読む", "Kisah Hasunosora — dibaca per bab")}</p>
        </header>
        <main className="flex-1 px-3 pt-3 pb-20 overflow-y-auto">{body}</main>
        <BottomNav
          onBack={() => router.back()}
          onMenu={() => setMenuOpen(!menuOpen)}
          onHome={() => router.push("/")}
          menuOpen={menuOpen}
        />
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      {/* ===== TABLET ===== */}
      <div className="hidden sm:flex lg:hidden flex-1 flex-col min-h-screen bg-background">
        <header className="px-6 pt-6 pb-2">
          <h1 className="text-2xl font-bold brand-gradient-text">{tr("活動記録", "Catatan Aktivitas")}</h1>
          <p className="text-xs text-text-dim mt-0.5">{tr("蓮ノ空の物語 — 章で読む", "Kisah Hasunosora — dibaca per bab")}</p>
        </header>
        <main className="flex-1 px-6 pt-4 pb-8 max-w-3xl mx-auto w-full">{body}</main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <header className="max-w-4xl mx-auto w-full px-8 pt-8 pb-2">
          <h1 className="text-3xl font-bold brand-gradient-text">{tr("活動記録", "Catatan Aktivitas")}</h1>
          <p className="text-sm text-text-dim mt-1">{tr("蓮ノ空の物語 — 章で読む", "Kisah Hasunosora — dibaca per bab")}</p>
        </header>
        <main className="max-w-4xl mx-auto w-full px-8 pt-4 pb-10 flex-1">{body}</main>
      </div>
    </>
  );
}

function ChapterCard({ chapter }: { chapter: ChapterNode }) {
  const { lang } = useLanguage();
  const d = chapter.chapterDetails;
  const color = d.colorTheme || "var(--linkura-primary)";
  const hero = d.heroImage?.node.sourceUrl;
  const label = lang === "jp" ? d.chapterLabelJp : d.chapterLabelId || d.chapterLabelJp;
  const desc = lang === "jp" ? d.descriptionJp : d.descriptionId || d.descriptionJp;
  const isInterlude = d.chapterType === "interlude";

  return (
    <Link
      href={`/katsudou-kiroku/${chapter.slug}`}
      className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all active:scale-[0.99]"
      style={{ border: "1px solid var(--linkura-border)" }}
    >
      {/* Big image / banner */}
      <div className="relative aspect-[16/7] overflow-hidden">
        {hero ? (
          <Image
            src={hero}
            alt={chapter.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 768px, 896px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}55)` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {/* Type badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow"
          style={{ background: isInterlude ? "rgba(0,0,0,0.55)" : color }}
        >
          {isInterlude ? "間章" : "章"}
        </span>

        {/* Title overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <h2 className="text-2xl font-extrabold text-white drop-shadow-lg leading-tight">
            {chapter.title}
          </h2>
          {label && (
            <p className="text-sm font-medium text-white/90 drop-shadow mt-0.5">{label}</p>
          )}
        </div>
      </div>

      {/* Description */}
      {desc && (
        <div className="px-4 py-3 bg-white">
          <p className="text-sm text-foreground/75 leading-relaxed line-clamp-2">{desc}</p>
        </div>
      )}
    </Link>
  );
}

function ChapterSkeleton() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden animate-pulse border border-border"
        >
          <div className="aspect-[16/7] bg-border/30" />
          <div className="px-4 py-3 space-y-2 bg-white">
            <div className="h-3 bg-border/40 rounded w-3/4" />
            <div className="h-3 bg-border/30 rounded w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
}
