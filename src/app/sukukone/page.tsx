"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GET_SUKUKONE = gql`
  query GetSukukoneVideos {
    sukukoneVideos(first: 100) {
      nodes {
        databaseId
        title
        slug
        sukukoneVideoDetails {
          tabType
          airDate
          youtubeVideoId
          durationSeconds
          summaryJp
          hasSubtitleJp
          hasSubtitleId
          thumbnail {
            node {
              sourceUrl
              altText
            }
          }
          performers {
            nodes {
              ... on Character {
                title
                slug
              }
            }
          }
          unit {
            nodes {
              ... on Unit {
                title
                unitDetails {
                  colorPrimary
                }
              }
            }
          }
        }
      }
    }
  }
`;

type SukukoneNode = {
  databaseId: number;
  title: string;
  slug: string;
  sukukoneVideoDetails: {
    tabType: string[] | null;
    airDate: string | null;
    youtubeVideoId: string | null;
    durationSeconds: number | null;
    summaryJp: string | null;
    hasSubtitleJp: boolean | null;
    hasSubtitleId: boolean | null;
    thumbnail: { node: { sourceUrl: string; altText: string } } | null;
    performers: { nodes: { title: string; slug: string }[] } | null;
    unit: {
      nodes: {
        title: string;
        unitDetails: { colorPrimary: string | null };
      }[];
    } | null;
  };
};

type QueryData = { sukukoneVideos: { nodes: SukukoneNode[] } };

type TabId = "upcoming" | "archives" | "wxstation" | "mv" | "ranking";

const TABS: { id: TabId; label: string; disabled: boolean; disabledMsg?: string }[] = [
  {
    id: "upcoming",
    label: "UPCOMING",
    disabled: true,
    disabledMsg: "Layanan Linkura telah berakhir — jadwal broadcast tidak tersedia lagi.",
  },
  { id: "archives", label: "ARCHIVES", disabled: false },
  { id: "wxstation", label: "WxSTATION", disabled: false },
  { id: "mv", label: "MUSIC VIDEO", disabled: false },
  {
    id: "ranking",
    label: "RANKING",
    disabled: true,
    disabledMsg: "Kompetisi ranking sudah tidak berjalan sejak layanan berakhir.",
  },
];

function filterByTab(videos: SukukoneNode[], tab: TabId): SukukoneNode[] {
  return videos.filter((v) => {
    const type = v.sukukoneVideoDetails.tabType?.[0];
    switch (tab) {
      case "archives":
        return type === "with_meets" || type === "fes_live";
      case "wxstation":
        return type === "with_station";
      case "mv":
        return type === "mv";
      default:
        return false;
    }
  });
}

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

function tabTypeLabel(type: string | undefined): string {
  switch (type) {
    case "with_meets": return "WithxMEETS";
    case "fes_live": return "FesxLIVE";
    case "with_station": return "WithxSTATION";
    case "mv": return "MV";
    default: return "Other";
  }
}

export default function SukukonePage() {
  const { data, loading, error } = useQuery<QueryData>(GET_SUKUKONE);
  const [activeTab, setActiveTab] = useState<TabId>("archives");
  const [disabledTooltip, setDisabledTooltip] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const videos = data?.sukukoneVideos?.nodes ?? [];
  const filtered = filterByTab(videos, activeTab);
  const activeTabConfig = TABS.find((t) => t.id === activeTab)!;

  const handleTabClick = (tab: typeof TABS[number]) => {
    if (tab.disabled) {
      setDisabledTooltip(tab.disabledMsg || null);
      setTimeout(() => setDisabledTooltip(null), 3000);
    } else {
      setActiveTab(tab.id);
      setDisabledTooltip(null);
    }
  };

  const tabBar = (
    <div className="flex overflow-x-auto scrollbar-hide">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab)}
          className={`shrink-0 px-4 py-2.5 text-xs font-bold tracking-wide transition-all duration-150 border-b-2 cursor-pointer ${
            tab.disabled
              ? "text-text-dim/40 border-transparent cursor-not-allowed"
              : activeTab === tab.id
                ? "text-primary border-primary"
                : "text-text-dim border-transparent hover:text-foreground hover:border-border"
          }`}
        >
          {tab.disabled && <span className="mr-1">🔒</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );

  const disabledBanner = disabledTooltip && (
    <div className="mx-3 mt-2 p-3 rounded-xl bg-surface-2 border border-border text-xs text-text-dim animate-in fade-in">
      🏁 {disabledTooltip}
    </div>
  );

  const videoList = loading ? (
    <VideoListSkeleton />
  ) : error ? (
    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
      <p className="font-medium">データ取得エラー</p>
      <p className="mt-1 text-xs opacity-70">{error.message}</p>
    </div>
  ) : filtered.length === 0 ? (
    <div className="py-12 text-center text-text-dim text-sm">
      {activeTabConfig.label}のコンテンツはまだありません
    </div>
  ) : (
    <div className="space-y-3">
      {filtered.map((v) => (
        <VideoCard key={v.databaseId} video={v} />
      ))}
    </div>
  );

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={videos.length} unitLabel="スクコネ" />

        <header className="px-3 pt-3">
          <h1 className="text-lg font-bold brand-gradient-text">
            スクールアイドルコネクト
          </h1>
        </header>

        {tabBar}
        {disabledBanner}

        <main className="flex-1 px-3 pt-3 pb-20 overflow-y-auto">
          {videoList}
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
        <header className="px-6 pt-6 pb-2">
          <h1 className="text-2xl font-bold brand-gradient-text">
            スクールアイドルコネクト
          </h1>
        </header>

        {tabBar}
        {disabledBanner}

        <main className="flex-1 px-6 pt-4 pb-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              <VideoListSkeleton grid />
            ) : filtered.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-text-dim text-sm">
                {activeTabConfig.label}のコンテンツはまだありません
              </div>
            ) : (
              filtered.map((v) => <VideoCard key={v.databaseId} video={v} card />)
            )}
          </div>
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <header className="max-w-5xl mx-auto w-full px-8 pt-8 pb-2">
          <h1 className="text-3xl font-bold brand-gradient-text">
            スクールアイドルコネクト
          </h1>
        </header>

        <div className="max-w-5xl mx-auto w-full px-8">
          {tabBar}
          {disabledBanner}
        </div>

        <main className="max-w-5xl mx-auto w-full px-8 pt-4 pb-8 flex-1">
          <div className="grid grid-cols-3 gap-5">
            {loading ? (
              <VideoListSkeleton grid />
            ) : filtered.length === 0 ? (
              <div className="col-span-3 py-12 text-center text-text-dim text-sm">
                {activeTabConfig.label}のコンテンツはまだありません
              </div>
            ) : (
              filtered.map((v) => <VideoCard key={v.databaseId} video={v} card />)
            )}
          </div>
        </main>
      </div>
    </>
  );
}

/* ── Sub-components ── */

function VideoCard({
  video,
  card,
}: {
  video: SukukoneNode;
  card?: boolean;
}) {
  const d = video.sukukoneVideoDetails;
  const unitColor = d.unit?.nodes[0]?.unitDetails.colorPrimary || "var(--linkura-primary)";
  const type = d.tabType?.[0];
  const thumbUrl = d.thumbnail?.node.sourceUrl;

  if (card) {
    return (
      <Link
        href={`/sukukone/${video.slug}`}
        className="group block rounded-xl overflow-hidden transition-all hover:shadow-lg"
        style={{ background: "var(--linkura-surface)", border: "1px solid var(--linkura-border)" }}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video" style={{ background: `${unitColor}15` }}>
          {thumbUrl ? (
            <img src={thumbUrl} alt={video.title} className="w-full h-full object-cover" />
          ) : d.youtubeVideoId ? (
            <img
              src={`https://img.youtube.com/vi/${d.youtubeVideoId}/mqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl opacity-30">🎤</span>
            </div>
          )}

          {/* Type badge */}
          <span
            className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white"
            style={{ background: unitColor }}
          >
            {tabTypeLabel(type)}
          </span>

          {d.durationSeconds && (
            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white">
              {formatDuration(d.durationSeconds)}
            </span>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <p className="text-[11px] text-text-dim mt-1">
            {formatDate(d.airDate)}
          </p>
        </div>
      </Link>
    );
  }

  // List variant (phone)
  return (
    <Link
      href={`/sukukone/${video.slug}`}
      className="group flex gap-3 p-2 rounded-xl transition-all hover:shadow-md"
      style={{ background: "var(--linkura-surface)", border: "1px solid var(--linkura-border)" }}
    >
      {/* Thumbnail */}
      <div className="relative w-32 shrink-0 aspect-video rounded-lg overflow-hidden" style={{ background: `${unitColor}15` }}>
        {thumbUrl ? (
          <img src={thumbUrl} alt={video.title} className="w-full h-full object-cover" />
        ) : d.youtubeVideoId ? (
          <img
            src={`https://img.youtube.com/vi/${d.youtubeVideoId}/mqdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl opacity-30">🎤</span>
          </div>
        )}

        <span
          className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
          style={{ background: unitColor }}
        >
          {tabTypeLabel(type)}
        </span>
      </div>

      <div className="flex-1 min-w-0 py-0.5">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-[11px] text-text-dim mt-1">{formatDate(d.airDate)}</p>
        {d.performers?.nodes && d.performers.nodes.length > 0 && (
          <p className="text-[10px] text-text-dim mt-0.5 truncate">
            {d.performers.nodes.map((p) => p.title).join(", ")}
          </p>
        )}
      </div>
    </Link>
  );
}

function VideoListSkeleton({ grid }: { grid?: boolean }) {
  const count = grid ? 6 : 4;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-xl overflow-hidden animate-pulse ${grid ? "" : "flex gap-3 p-2"}`}
          style={{ background: "var(--linkura-surface)", border: "1px solid var(--linkura-border)" }}
        >
          <div className={`${grid ? "aspect-video" : "w-32 shrink-0 aspect-video rounded-lg"} bg-border/30`} />
          <div className={`${grid ? "p-3" : "flex-1 py-1"} space-y-2`}>
            <div className="h-4 bg-border/40 rounded w-3/4" />
            <div className="h-3 bg-border/30 rounded w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
}
