"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { StatusBar } from "@/components/ui/StatusBar";
import { SourcesList, withCitations } from "@/components/ui/SourcesList";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { LinkuraPlayer } from "@/components/video/LinkuraPlayer";
import { CommentSection } from "@/components/comments/CommentSection";
import { useLanguage } from "@/lib/language";
import { translate } from "@/lib/translations";
import { EPISODE_FIELDS, type EpisodeStructure } from "@/graphql/fragments/episode";
import { PART_FIELDS, type PartNode } from "@/graphql/fragments/part";

const GET_EPISODE_DETAIL = gql`
  ${EPISODE_FIELDS}
  ${PART_FIELDS}
  query GetEpisodeDetail($slug: ID!) {
    episode(id: $slug, idType: SLUG) {
      ...EpisodeFields
    }
    episodeParts(first: 100) {
      nodes {
        ...PartFields
      }
    }
  }
`;

type EpisodeDetail = {
  databaseId: number;
  title: string;
  slug: string;
  episodeDetails: {
    releaseDate: string | null;
    episodeNumber: number | null;
    durationSeconds: number | null;
    youtubeUrl: string | null;
    youtubeVideoId: string | null;
    summaryJp: string | null;
    summaryId: string | null;
    hasSubtitleJp: boolean | null;
    hasSubtitleId: boolean | null;
    originalSource: string | null;
    archiveNotes: string | null;
  };
  episodeStructure: EpisodeStructure;
};

type QueryData = {
  episode: EpisodeDetail | null;
  episodeParts: { nodes: PartNode[] };
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}分${s > 0 ? `${s}秒` : ""}`;
}

export default function EpisodeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang } = useLanguage();
  const tr = (jp: string, id: string) => (lang === "jp" ? jp : id);
  const slug = params.slug as string;

  const { data, loading, error } = useQuery<QueryData>(GET_EPISODE_DETAIL, {
    variables: { slug },
  });

  const ep = data?.episode ?? null;
  const d = ep?.episodeDetails;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-text-dim">{translate("common.loading", lang)}</div>
      </div>
    );
  }

  if (error || !ep || !d) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">
            {error ? translate("common.error", lang) : translate("common.notFound", lang)}
          </p>
          <Link href="/katsudou-kiroku" className="mt-4 inline-block text-sm underline text-primary">
            {translate("episodes.backToList", lang)}
          </Link>
        </div>
      </div>
    );
  }

  const chapter = ep.episodeStructure?.chapter?.nodes?.[0] ?? null;
  const gen = ep.episodeStructure?.generation?.[0];
  const month = ep.episodeStructure?.storyMonth;
  const summary = lang === "jp" ? d.summaryJp : d.summaryId || d.summaryJp;

  // parts milik episode ini, urut by partNumber/menuOrder
  const parts = (data?.episodeParts?.nodes ?? [])
    .filter((p) => p.partDetails.parentEpisode?.nodes?.[0]?.slug === slug)
    .sort(
      (a, b) =>
        (a.partDetails.partNumber ?? a.menuOrder ?? 0) -
        (b.partDetails.partNumber ?? b.menuOrder ?? 0)
    );

  const backHref = chapter ? `/katsudou-kiroku/${chapter.slug}` : "/katsudou-kiroku";
  const backLabel = chapter ? `← ${chapter.title}` : translate("episodes.backToList", lang);

  const header = (
    <div className="flex items-start gap-4">
      {/* Kiri-atas: 期 + 月 */}
      <div className="shrink-0">
        {gen && (
          <div className="text-2xl font-extrabold brand-gradient-text leading-none">{gen}期</div>
        )}
        {month && <div className="text-xs text-text-dim mt-1">{month}</div>}
      </div>
      {/* Kanan-atas dominan: judul + deskripsi */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold leading-tight">{ep.title}</h1>
        <p className="text-xs text-text-dim mt-1">
          {formatDate(d.releaseDate)}
          {d.episodeNumber ? ` · 第${d.episodeNumber}話` : ""}
        </p>
        {summary && (
          <p className="text-sm leading-relaxed text-foreground/80 mt-2">{withCitations(summary)}</p>
        )}
      </div>
    </div>
  );

  const partsSection =
    parts.length > 0 ? (
      <div className="mt-6 space-y-6">
        <h2 className="text-sm font-bold text-primary">{tr("パート", "Part")}</h2>
        {parts.map((p) => {
          const pd = p.partDetails;
          return (
            <div key={p.databaseId} className="rounded-2xl border border-border overflow-hidden">
              <div className="px-3 py-2 bg-surface-2/50 flex items-center justify-between">
                <span className="text-sm font-bold">
                  Part {pd.partNumber ?? "-"}
                </span>
                {pd.durationSeconds ? (
                  <span className="text-[11px] text-text-dim">{formatDuration(pd.durationSeconds)}</span>
                ) : null}
              </div>
              <div className="p-3">
                <LinkuraPlayer
                  videoId={pd.youtubeVideoId || undefined}
                  mirrorUrl={pd.mirrorUrl || undefined}
                  title={p.title}
                  accentColor="#8b82f5"
                  hasSubtitleJp={!!pd.hasSubtitleJp}
                  hasSubtitleId={!!pd.hasSubtitleId}
                />
                {(lang === "jp" ? pd.summaryJp : pd.summaryId || pd.summaryJp) && (
                  <p className="text-sm leading-relaxed text-foreground/80 mt-3">
                    {lang === "jp" ? pd.summaryJp : pd.summaryId || pd.summaryJp}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      /* Fallback: episode tanpa part — tampilkan video utama episode (legacy) */
      <div className="mt-6">
        {d.youtubeVideoId ? (
          <LinkuraPlayer
            videoId={d.youtubeVideoId}
            title={ep.title}
            accentColor="#8b82f5"
            hasSubtitleJp={!!d.hasSubtitleJp}
            hasSubtitleId={!!d.hasSubtitleId}
          />
        ) : (
          <div className="w-full aspect-video rounded-xl flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg, var(--linkura-surface-2), var(--linkura-border))" }}>
            <span className="text-4xl mb-2">📼</span>
            <p className="text-sm text-text-dim">{translate("episodes.noVideo", lang)}</p>
            {d.archiveNotes && <p className="text-xs text-text-dim mt-1 opacity-60">{d.archiveNotes}</p>}
          </div>
        )}
      </div>
    );

  const content = (
    <>
      <Link href={backHref} className="text-xs text-text-dim hover:underline">
        {backLabel}
      </Link>
      <div className="mt-3">{header}</div>
      {partsSection}
      {d.originalSource && (
        <a
          href={d.originalSource}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-xs underline text-text-dim hover:text-foreground"
        >
          {translate("episodes.originalSource", lang)}
        </a>
      )}
      <SourcesList raw={ep.episodeStructure?.sources} accent="#8b82f5" />
      <CommentSection postDatabaseId={ep.databaseId} accentColor="#8b82f5" />
    </>
  );

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={d.episodeNumber ?? 0} unitLabel={translate("nav.episodes", lang)} />
        <main className="flex-1 px-3 pt-2 pb-20 overflow-y-auto">{content}</main>
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
        <main className="flex-1 px-6 py-6 max-w-2xl mx-auto w-full">{content}</main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <main className="max-w-4xl mx-auto w-full px-8 py-8">{content}</main>
      </div>
    </>
  );
}
