"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useState } from "react";
import Link from "next/link";
import { LinkuraPlayer } from "@/components/video/LinkuraPlayer";
import { useLanguage } from "@/lib/language";
import { translate } from "@/lib/translations";
import { CommentSection } from "@/components/comments/CommentSection";

const GET_SUKUKONE_VIDEO = gql`
  query GetSukukoneVideo($slug: ID!) {
    sukukoneVideo(id: $slug, idType: SLUG) {
      databaseId
      title
      slug
      sukukoneVideoDetails {
        tabType
        airDate
        youtubeUrl
        youtubeVideoId
        durationSeconds
        summaryJp
        summaryId
        hasSubtitleJp
        hasSubtitleId
        archiveNotes
        thumbnail {
          node {
            sourceUrl
            altText
          }
        }
        performers {
          nodes {
            ... on Character {
              databaseId
              title
              slug
              characterDetails {
                nameJp
                colorTheme
                imageMain {
                  node {
                    sourceUrl
                  }
                }
              }
            }
          }
        }
        unit {
          nodes {
            ... on Unit {
              title
              slug
              unitDetails {
                nameJp
                colorPrimary
              }
            }
          }
        }
        episodeRelation {
          nodes {
            ... on Episode {
              title
              slug
              episodeDetails {
                episodeNumber
              }
            }
          }
        }
      }
    }
  }
`;

type PerformerNode = {
  databaseId: number;
  title: string;
  slug: string;
  characterDetails: {
    nameJp: string;
    colorTheme: string | null;
    imageMain: { node: { sourceUrl: string } } | null;
  };
};

type UnitNode = {
  title: string;
  slug: string;
  unitDetails: { nameJp: string; colorPrimary: string | null };
};

type EpisodeNode = {
  title: string;
  slug: string;
  episodeDetails: { episodeNumber: number | null };
};

type SukukoneVideo = {
  databaseId: number;
  title: string;
  slug: string;
  sukukoneVideoDetails: {
    tabType: string[] | null;
    airDate: string | null;
    youtubeUrl: string | null;
    youtubeVideoId: string | null;
    durationSeconds: number | null;
    summaryJp: string | null;
    summaryId: string | null;
    hasSubtitleJp: boolean | null;
    hasSubtitleId: boolean | null;
    archiveNotes: string | null;
    thumbnail: { node: { sourceUrl: string; altText: string } } | null;
    performers: { nodes: PerformerNode[] } | null;
    unit: { nodes: UnitNode[] } | null;
    episodeRelation: { nodes: EpisodeNode[] } | null;
  };
};

type QueryData = { sukukoneVideo: SukukoneVideo | null };

function tabTypeLabel(type: string | undefined): string {
  switch (type) {
    case "with_meets": return "WithxMEETS";
    case "fes_live": return "FesxLIVE";
    case "with_station": return "WithxSTATION";
    case "mv": return "MUSIC VIDEO";
    default: return "Other";
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function SukukoneDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, t } = useLanguage();
  const slug = params.slug as string;

  const { data, loading, error } = useQuery<QueryData>(GET_SUKUKONE_VIDEO, {
    variables: { slug },
  });

  const video = data?.sukukoneVideo;
  const d = video?.sukukoneVideoDetails;
  const tabType = d?.tabType?.[0];
  const unit = d?.unit?.nodes?.[0];
  const unitColor = unit?.unitDetails.colorPrimary || "#8b82f5";
  const performers = d?.performers?.nodes ?? [];
  const relatedEpisode = d?.episodeRelation?.nodes?.[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-text-dim">読み込み中...</div>
      </div>
    );
  }

  if (error || !video || !d) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">
            {error ? "エラー" : "動画が見つかりません"}
          </p>
          <Link href="/sukukone" className="mt-4 inline-block text-sm underline text-primary">
            スクコネに戻る
          </Link>
        </div>
      </div>
    );
  }

  // YouTube embed
  const videoEmbed = d.youtubeVideoId ? (
    <LinkuraPlayer
      videoId={d.youtubeVideoId}
      title={video.title}
      accentColor={unitColor}
      thumbnailUrl={d.thumbnail?.node.sourceUrl}
      hasSubtitleJp={!!d.hasSubtitleJp}
      hasSubtitleId={!!d.hasSubtitleId}
    />
  ) : (
    <div
      className="relative w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center"
      style={{ background: `${unitColor}15` }}
    >
      {d.thumbnail?.node.sourceUrl ? (
        <img src={d.thumbnail.node.sourceUrl} alt={video.title} className="w-full h-full object-cover" />
      ) : (
        <div className="text-center">
          <span className="text-5xl">🎤</span>
          <p className="text-sm text-text-dim mt-2">動画は準備中です</p>
        </div>
      )}
    </div>
  );

  // Info table rows
  const infoRows: { label: string; value: React.ReactNode }[] = [];

  infoRows.push({
    label: translate("sukukone.type", lang),
    value: (
      <span
        className="inline-block px-2 py-0.5 rounded text-xs font-bold text-white"
        style={{ background: unitColor }}
      >
        {tabTypeLabel(tabType)}
      </span>
    ),
  });

  if (d.airDate) infoRows.push({ label: translate("episodes.airDate", lang), value: formatDate(d.airDate) });
  if (d.durationSeconds) infoRows.push({ label: translate("episodes.duration", lang), value: formatDuration(d.durationSeconds) });

  if (unit) {
    infoRows.push({
      label: translate("sukukone.unit", lang),
      value: (
        <Link href={`/units/${unit.slug}`} className="hover:underline" style={{ color: unitColor }}>
          {unit.unitDetails.nameJp}
        </Link>
      ),
    });
  }

  if (d.hasSubtitleJp || d.hasSubtitleId) {
    const subs: string[] = [];
    if (d.hasSubtitleJp) subs.push("JP");
    if (d.hasSubtitleId) subs.push("ID");
    infoRows.push({ label: translate("sukukone.subtitle", lang), value: subs.join(" / ") });
  }

  if (relatedEpisode) {
    infoRows.push({
      label: translate("sukukone.relatedEp", lang),
      value: (
        <Link href={`/episodes/${relatedEpisode.slug}`} className="hover:underline text-primary">
          {relatedEpisode.episodeDetails.episodeNumber
            ? `#${relatedEpisode.episodeDetails.episodeNumber} `
            : ""}
          {relatedEpisode.title}
        </Link>
      ),
    });
  }

  const infoTable = (
    <div className="rounded-xl overflow-hidden border border-border">
      {infoRows.map((row, i) => (
        <div
          key={i}
          className={`flex items-center px-4 py-2.5 text-sm ${i > 0 ? "border-t border-border" : ""}`}
        >
          <span className="text-text-dim w-16 shrink-0">{row.label}</span>
          <span className="font-medium">{row.value}</span>
        </div>
      ))}
    </div>
  );

  // Performers section
  const performersSection = performers.length > 0 && (
    <div className="mt-4">
      <h2 className="text-sm font-bold text-text-dim mb-2">{translate("sukukone.performers", lang)}</h2>
      <div className="flex flex-wrap gap-2">
        {performers.map((p) => (
          <Link
            key={p.databaseId}
            href={`/characters/${p.slug}`}
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors hover:shadow-md"
            style={{
              background: `${p.characterDetails.colorTheme || "#8b82f5"}10`,
              border: `1px solid ${p.characterDetails.colorTheme || "#8b82f5"}30`,
            }}
          >
            {p.characterDetails.imageMain?.node.sourceUrl ? (
              <img
                src={p.characterDetails.imageMain.node.sourceUrl}
                alt={p.characterDetails.nameJp}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: p.characterDetails.colorTheme || "#8b82f5" }}
              >
                {p.characterDetails.nameJp[0]}
              </div>
            )}
            <span className="text-sm font-medium">{p.characterDetails.nameJp}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  // Summary section — show only the active language, fallback to other
  const summaryHtml = t(d.summaryJp, d.summaryId);
  const summarySection = summaryHtml ? (
    <div className="mt-4">
      <h2 className="text-sm font-bold text-text-dim mb-1">{translate("sukukone.summary", lang)}</h2>
      <div
        className="text-sm leading-relaxed text-foreground/80"
        dangerouslySetInnerHTML={{ __html: summaryHtml }}
      />
    </div>
  ) : null;

  const commentsSection = <CommentSection postDatabaseId={video.databaseId} accentColor={unitColor} />;

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={0} unitLabel="スクコネ" />
        <main className="flex-1 px-3 pt-2 pb-20 overflow-y-auto">
          <Link href="/sukukone" className="text-xs text-text-dim hover:underline">
            {`← ${translate("nav.sukukone", lang)}`}
          </Link>
          <h1 className="text-lg font-bold mt-2 mb-3">{video.title}</h1>
          {videoEmbed}
          <div className="mt-3">{infoTable}</div>
          {performersSection}
          {summarySection}
          {commentsSection}
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
          <Link href="/sukukone" className="text-xs text-text-dim hover:underline">
            {`← ${translate("nav.sukukone", lang)}`}
          </Link>
          <h1 className="text-xl font-bold mt-3 mb-4">{video.title}</h1>
          {videoEmbed}
          <div className="flex gap-6 mt-4">
            <div className="flex-1">
              {performersSection}
              {summarySection}
              {commentsSection}
            </div>
            <div className="w-64 shrink-0">
              {infoTable}
            </div>
          </div>
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <main className="max-w-5xl mx-auto w-full px-8 py-8">
          <Link href="/sukukone" className="text-sm text-text-dim hover:underline">
            {`← ${translate("nav.sukukone", lang)}`}
          </Link>
          <h1 className="text-2xl font-bold mt-4 mb-4">{video.title}</h1>
          <div className="flex gap-8">
            <div className="flex-1">
              {videoEmbed}
              {performersSection}
              {summarySection}
              {commentsSection}
            </div>
            <div className="w-72 shrink-0">
              {infoTable}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
