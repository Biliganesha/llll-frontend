"use client";

import { useState, useMemo } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GET_SEARCH_DATA = gql`
  query GetSearchData {
    episodes(first: 500) {
      nodes {
        databaseId
        title
        slug
        episodeDetails {
          releaseDate
          episodeNumber
          youtubeVideoId
        }
      }
    }
    sukukoneVideos(first: 500) {
      nodes {
        databaseId
        title
        slug
        sukukoneVideoDetails {
          tabType
          airDate
          youtubeVideoId
        }
      }
    }
    characters(first: 50) {
      nodes {
        databaseId
        title
        slug
        characterDetails {
          nameJp
          nameRomaji
          seiyuu
          colorTheme
          imageMain {
            node {
              sourceUrl
            }
          }
        }
      }
    }
    units(first: 20) {
      nodes {
        databaseId
        title
        slug
        unitDetails {
          nameJp
          nameRomaji
          colorPrimary
        }
      }
    }
  }
`;

type SearchResult = {
  id: number;
  title: string;
  subtitle: string;
  href: string;
  type: "episode" | "sukukone" | "character" | "unit";
  color: string;
  imageUrl?: string;
};

type FilterType = "all" | "episode" | "sukukone" | "character" | "unit";

const FILTER_OPTIONS: { id: FilterType; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "episode", label: "活動記録" },
  { id: "sukukone", label: "スクコネ" },
  { id: "character", label: "メンバー" },
  { id: "unit", label: "ユニット" },
];

function tabTypeLabel(type: string | undefined): string {
  switch (type) {
    case "with_meets": return "WithxMEETS";
    case "fes_live": return "FesxLIVE";
    case "with_station": return "WithxSTATION";
    case "mv": return "MV";
    default: return "";
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildSearchIndex(data: any): SearchResult[] {
  if (!data) return [];
  const results: SearchResult[] = [];

  for (const ep of data.episodes.nodes) {
    const d = ep.episodeDetails;
    results.push({
      id: ep.databaseId,
      title: ep.title,
      subtitle: [d.episodeNumber ? `#${d.episodeNumber}` : null, formatDate(d.releaseDate)].filter(Boolean).join(" · "),
      href: `/katsudou-kiroku/${ep.slug}`,
      type: "episode",
      color: "#8b82f5",
    });
  }

  for (const sv of data.sukukoneVideos.nodes) {
    const d = sv.sukukoneVideoDetails;
    results.push({
      id: sv.databaseId,
      title: sv.title,
      subtitle: [tabTypeLabel(d.tabType?.[0]), formatDate(d.airDate)].filter(Boolean).join(" · "),
      href: `/sukukone/${sv.slug}`,
      type: "sukukone",
      color: "#ef5a8f",
    });
  }

  for (const ch of data.characters.nodes) {
    const d = ch.characterDetails;
    results.push({
      id: ch.databaseId,
      title: d.nameJp || ch.title,
      subtitle: [d.nameRomaji, d.seiyuu ? `CV: ${d.seiyuu}` : null].filter(Boolean).join(" · "),
      href: `/characters/${ch.slug}`,
      type: "character",
      color: d.colorTheme || "#8b82f5",
      imageUrl: d.imageMain?.node.sourceUrl,
    });
  }

  for (const u of data.units.nodes) {
    const d = u.unitDetails;
    results.push({
      id: u.databaseId,
      title: d.nameJp || u.title,
      subtitle: d.nameRomaji || "",
      href: `/units/${u.slug}`,
      type: "unit",
      color: d.colorPrimary || "#8b82f5",
    });
  }

  return results;
}

function searchFilter(items: SearchResult[], query: string, filter: FilterType): SearchResult[] {
  let filtered = items;

  if (filter !== "all") {
    filtered = filtered.filter((r) => r.type === filter);
  }

  if (!query.trim()) return filtered;

  const q = query.toLowerCase().trim();
  return filtered.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.subtitle.toLowerCase().includes(q)
  );
}

const TYPE_LABELS: Record<string, string> = {
  episode: "活動記録",
  sukukone: "スクコネ",
  character: "メンバー",
  unit: "ユニット",
};

export default function SearchPage() {
  const { data, loading } = useQuery(GET_SEARCH_DATA);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const searchIndex = useMemo(() => buildSearchIndex(data), [data]);
  const results = useMemo(() => searchFilter(searchIndex, query, filter), [searchIndex, query, filter]);

  const hasQuery = query.trim().length > 0;

  const searchInput = (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="エピソード、メンバー、ユニットを検索..."
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        autoFocus
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-surface-2 flex items-center justify-center text-text-dim hover:bg-border transition-colors cursor-pointer"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );

  const filterChips = (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mt-3">
      {FILTER_OPTIONS.map((opt) => {
        const count = opt.id === "all"
          ? searchIndex.length
          : searchIndex.filter((r) => r.type === opt.id).length;
        return (
          <button
            key={opt.id}
            onClick={() => setFilter(opt.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              filter === opt.id
                ? "bg-primary text-white"
                : "bg-surface-2 text-text-dim hover:bg-border"
            }`}
          >
            {opt.label} ({count})
          </button>
        );
      })}
    </div>
  );

  const resultsList = loading ? (
    <div className="space-y-2 mt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse bg-surface border border-border">
          <div className="w-10 h-10 rounded-lg bg-border/40" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-border/40 rounded w-3/4" />
            <div className="h-3 bg-border/30 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  ) : !hasQuery && filter === "all" ? (
    <div className="mt-8 text-center">
      <span className="text-4xl">🔍</span>
      <p className="text-sm text-text-dim mt-3">キーワードを入力するか、カテゴリを選択してください</p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        {FILTER_OPTIONS.filter((o) => o.id !== "all").map((opt) => {
          const count = searchIndex.filter((r) => r.type === opt.id).length;
          return (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className="p-4 rounded-xl bg-surface border border-border text-center hover:shadow-md transition-all cursor-pointer"
            >
              <span className="text-2xl">
                {opt.id === "episode" ? "📼" : opt.id === "sukukone" ? "🎤" : opt.id === "character" ? "🎀" : "💫"}
              </span>
              <p className="text-sm font-medium mt-1">{opt.label}</p>
              <p className="text-xs text-text-dim">{count}件</p>
            </button>
          );
        })}
      </div>
    </div>
  ) : results.length === 0 ? (
    <div className="mt-8 text-center">
      <span className="text-4xl">😔</span>
      <p className="text-sm text-text-dim mt-3">
        「{query}」に一致する結果はありません
      </p>
    </div>
  ) : (
    <div className="space-y-1.5 mt-4">
      <p className="text-xs text-text-dim mb-2">{results.length}件の結果</p>
      {results.map((r) => (
        <Link
          key={`${r.type}-${r.id}`}
          href={r.href}
          className="flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-md bg-surface border border-border"
        >
          {/* Icon/avatar */}
          {r.imageUrl ? (
            <img
              src={r.imageUrl}
              alt={r.title}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: r.color }}
            >
              {r.type === "episode" ? "📼" : r.type === "sukukone" ? "🎤" : r.type === "unit" ? "💫" : r.title[0]}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate">{r.title}</h3>
            {r.subtitle && (
              <p className="text-[11px] text-text-dim truncate">{r.subtitle}</p>
            )}
          </div>

          <span
            className="shrink-0 px-2 py-0.5 rounded text-[10px] font-medium"
            style={{ background: `${r.color}15`, color: r.color }}
          >
            {TYPE_LABELS[r.type]}
          </span>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={0} unitLabel="検索" />
        <main className="flex-1 px-3 pt-3 pb-20 overflow-y-auto">
          <h1 className="text-xl font-bold brand-gradient-text mb-3">検索</h1>
          {searchInput}
          {filterChips}
          {resultsList}
        </main>
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
        <main className="flex-1 px-6 py-6">
          <h1 className="text-2xl font-bold brand-gradient-text mb-4">検索</h1>
          <div className="max-w-lg">
            {searchInput}
            {filterChips}
          </div>
          {resultsList}
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <main className="max-w-3xl mx-auto w-full px-8 py-8">
          <h1 className="text-3xl font-bold brand-gradient-text mb-4">検索</h1>
          <div className="max-w-lg">
            {searchInput}
            {filterChips}
          </div>
          {resultsList}
        </main>
      </div>
    </>
  );
}
