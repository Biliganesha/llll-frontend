"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GET_EPISODES = gql`
  query GetEpisodes {
    episodes(first: 100, where: { orderby: { field: DATE, order: ASC } }) {
      nodes {
        databaseId
        title
        slug
        episodeDetails {
          releaseDate
          episodeNumber
          durationSeconds
          youtubeVideoId
          summaryJp: ringkasanJp
          hasSubtitleJp: subtitleJpTersedia
          hasSubtitleId: subtitleIdTersedia
          archiveNotes: catatanArsipInternal
        }
      }
    }
  }
`;

type EpisodeNode = {
  databaseId: number;
  title: string;
  slug: string;
  episodeDetails: {
    releaseDate: string | null;
    episodeNumber: number | null;
    durationSeconds: number | null;
    youtubeVideoId: string | null;
    summaryJp: string | null;
    hasSubtitleJp: boolean | null;
    hasSubtitleId: boolean | null;
    archiveNotes: string | null;
  };
};

type QueryData = {
  episodes: { nodes: EpisodeNode[] };
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Group episodes by year from releaseDate */
function groupByYear(episodes: EpisodeNode[]) {
  const groups: Record<string, EpisodeNode[]> = {};
  for (const ep of episodes) {
    const year = ep.episodeDetails.releaseDate
      ? new Date(ep.episodeDetails.releaseDate).getFullYear().toString()
      : "不明";
    if (!groups[year]) groups[year] = [];
    groups[year].push(ep);
  }
  // Sort years ascending
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

export default function EpisodesPage() {
  const { data, loading, error } = useQuery<QueryData>(GET_EPISODES);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const episodes = data?.episodes?.nodes ?? [];
  const grouped = groupByYear(episodes);

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen wallpaper-default relative">
        <StatusBar episodeCount={episodes.length} unitLabel="活動記録" />

        <main className="flex-1 px-3 pt-3 pb-20 overflow-y-auto">
          <h1 className="text-xl font-bold brand-gradient-text mb-1">
            活動記録
          </h1>
          <p className="text-xs text-text-dim mb-4">
            蓮の空の物語 — {episodes.length}話
          </p>

          {loading ? (
            <EpisodeListSkeleton />
          ) : error ? (
            <ErrorMsg message={error.message} />
          ) : (
            <div className="space-y-5">
              {grouped.map(([year, eps]) => (
                <YearSection key={year} year={year} episodes={eps} variant="phone" />
              ))}
            </div>
          )}
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
        <header className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold brand-gradient-text">活動記録</h1>
          <p className="text-sm text-text-dim mt-1">
            蓮の空の物語 — {episodes.length}話
          </p>
        </header>

        <main className="flex-1 px-6 pb-6 overflow-y-auto">
          {loading ? (
            <EpisodeListSkeleton />
          ) : error ? (
            <ErrorMsg message={error.message} />
          ) : (
            <div className="space-y-6">
              {grouped.map(([year, eps]) => (
                <YearSection key={year} year={year} episodes={eps} variant="tablet" />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <header className="max-w-5xl mx-auto w-full px-8 pt-8 pb-6">
          <h1 className="text-3xl font-bold brand-gradient-text">活動記録</h1>
          <p className="text-sm text-text-dim mt-1">
            蓮の空の物語 — {episodes.length}話
          </p>
        </header>

        <main className="max-w-5xl mx-auto w-full px-8 pb-8 flex-1">
          {loading ? (
            <EpisodeListSkeleton />
          ) : error ? (
            <ErrorMsg message={error.message} />
          ) : (
            <div className="space-y-8">
              {grouped.map(([year, eps]) => (
                <YearSection key={year} year={year} episodes={eps} variant="desktop" />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

/* ── Sub-components ── */

function YearSection({
  year,
  episodes,
  variant,
}: {
  year: string;
  episodes: EpisodeNode[];
  variant: "phone" | "tablet" | "desktop";
}) {
  return (
    <section>
      <h2 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: "var(--linkura-primary)" }}
        />
        {year}年
      </h2>

      <div className="space-y-2">
        {episodes.map((ep) => (
          <EpisodeRow key={ep.databaseId} episode={ep} variant={variant} />
        ))}
      </div>
    </section>
  );
}

function EpisodeRow({
  episode,
  variant,
}: {
  episode: EpisodeNode;
  variant: "phone" | "tablet" | "desktop";
}) {
  const d = episode.episodeDetails;
  const hasVideo = !!d.youtubeVideoId;

  return (
    <Link
      href={`/katsudou-kiroku/${episode.slug}`}
      className="group flex items-start gap-3 p-3 rounded-xl transition-all duration-150 hover:shadow-md"
      style={{
        background: "var(--linkura-surface)",
        border: "1px solid var(--linkura-border)",
      }}
    >
      {/* Episode number badge */}
      <div
        className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
        style={{
          background: hasVideo
            ? "linear-gradient(135deg, var(--linkura-primary), #ef5a8f)"
            : "var(--linkura-border)",
          color: hasVideo ? "#fff" : "var(--linkura-text-dim)",
        }}
      >
        {d.episodeNumber ?? "?"}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors truncate">
          {episode.title}
        </h3>

        <div className="flex items-center gap-2 mt-1 text-[11px] text-text-dim">
          {d.releaseDate && <span>{formatDate(d.releaseDate)}</span>}
          {d.durationSeconds && (
            <>
              <span className="opacity-30">|</span>
              <span>{formatDuration(d.durationSeconds)}</span>
            </>
          )}
          {d.hasSubtitleJp && <span className="px-1 py-0.5 rounded bg-surface-2 text-[10px]">JP字幕</span>}
          {d.hasSubtitleId && <span className="px-1 py-0.5 rounded bg-surface-2 text-[10px]">ID字幕</span>}
        </div>

        {variant !== "phone" && d.summaryJp && (
          <p className="mt-1.5 text-xs text-text-dim line-clamp-2">
            {d.summaryJp}
          </p>
        )}
      </div>

      {/* Video indicator */}
      <div className="shrink-0 self-center">
        {hasVideo ? (
          <span className="text-primary text-lg">▶</span>
        ) : (
          <span className="text-text-dim text-xs opacity-40">未収録</span>
        )}
      </div>
    </Link>
  );
}

function EpisodeListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-xl animate-pulse"
          style={{ background: "var(--linkura-surface)", border: "1px solid var(--linkura-border)" }}
        >
          <div className="w-10 h-10 rounded-lg bg-border/40" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-border/40 rounded w-3/4" />
            <div className="h-3 bg-border/30 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorMsg({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
      <p className="font-medium">データ取得エラー</p>
      <p className="mt-1 text-xs opacity-70">{message}</p>
    </div>
  );
}
