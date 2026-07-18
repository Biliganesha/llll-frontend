"use client";

import { useState, type ReactNode } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/language";
import { unitDisplayColors } from "@/lib/unit-colors";

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
                slug
                unitDetails {
                  colorPrimary
                  logo {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

type UnitNode = {
  title: string;
  slug: string | null;
  unitDetails: {
    colorPrimary: string | null;
    logo: { node: { sourceUrl: string; altText: string } } | null;
  };
};

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
    unit: { nodes: UnitNode[] } | null;
  };
};

type QueryData = { sukukoneVideos: { nodes: SukukoneNode[] } };

type TabId = "upcoming" | "memorize" | "archives" | "wxstation" | "mv" | "channel" | "ranking";

/** Ikon line-art kecil per tab (ala app: ikon di atas label). */
const TAB_ICONS: Record<TabId, ReactNode> = {
  upcoming: (
    <>
      <circle cx="12" cy="14" r="3" />
      <path d="M5.5 8.5a8 8 0 0 1 13 0M8 11a4.5 4.5 0 0 1 8 0" />
    </>
  ),
  memorize: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="m3 16 5-4 4 3 4-4 5 4M9 3h6" />
    </>
  ),
  archives: (
    <>
      <path d="M12 4v9m0 0 3.5-3.5M12 13 8.5 9.5" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </>
  ),
  wxstation: (
    <>
      <rect x="3" y="7" width="13" height="12" rx="2" />
      <path d="m16 11 5-3v10l-5-3" />
    </>
  ),
  mv: (
    <>
      <circle cx="7" cy="18" r="2.5" />
      <circle cx="17" cy="16" r="2.5" />
      <path d="M9.5 18V7l10-2v11" />
    </>
  ),
  channel: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="m8 3 4 4 4-4" />
    </>
  ),
  ranking: (
    <>
      <path d="m3 8 4 3 5-6 5 6 4-3-1.5 10h-15z" />
      <path d="M7 21h10" />
    </>
  ),
};

const TABS: { id: TabId; label: string; emptyMsg?: { jp: string; id: string } }[] = [
  {
    id: "upcoming",
    label: "UPCOMING",
    emptyMsg: {
      jp: "現在予定されている配信はありません。",
      id: "Belum ada siaran yang dijadwalkan saat ini.",
    },
  },
  { id: "memorize", label: "WithxMEMORIES" },
  { id: "archives", label: "ARCHIVES" },
  { id: "wxstation", label: "WxSTATION" },
  { id: "mv", label: "MUSIC VIDEO" },
  { id: "channel", label: "CHANNEL" },
  {
    id: "ranking",
    label: "RANKING",
    emptyMsg: {
      jp: "現在予定されているランキングはありません。",
      id: "Belum ada ranking yang dijadwalkan saat ini.",
    },
  },
];

type UnitInfo = { title: string; slug: string | null; color: string; logo: string | null };

function filterByTab(videos: SukukoneNode[], tab: TabId): SukukoneNode[] {
  if (tab === "channel") return videos;
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

function unitOf(v: SukukoneNode): UnitNode | undefined {
  return v.sukukoneVideoDetails.unit?.nodes[0];
}

function collectUnits(videos: SukukoneNode[]): UnitInfo[] {
  const map = new Map<string, UnitInfo>();
  for (const v of videos) {
    const u = unitOf(v);
    if (!u || map.has(u.title)) continue;
    map.set(u.title, {
      title: u.title,
      slug: u.slug ?? null,
      color: u.unitDetails.colorPrimary || "var(--linkura-primary)",
      logo: u.unitDetails.logo?.node.sourceUrl ?? null,
    });
  }
  return [...map.values()];
}

function collectPerformers(videos: SukukoneNode[]): { title: string; slug: string }[] {
  const map = new Map<string, { title: string; slug: string }>();
  for (const v of videos) {
    for (const p of v.sukukoneVideoDetails.performers?.nodes ?? []) {
      if (!map.has(p.slug)) map.set(p.slug, p);
    }
  }
  return [...map.values()];
}

function applyFilters(
  videos: SukukoneNode[],
  filterUnit: string | null,
  filterPerformer: string | null
): SukukoneNode[] {
  return videos.filter((v) => {
    if (filterUnit && unitOf(v)?.title !== filterUnit) return false;
    if (
      filterPerformer &&
      !(v.sukukoneVideoDetails.performers?.nodes ?? []).some((p) => p.slug === filterPerformer)
    )
      return false;
    return true;
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

const MEMORIZE_WINDOW_DAYS = 10;

/** Jarak (hari) tanggal video dari hari ini, lintas tahun (poin 11 — WithxMEMORIES). */
function dayDistanceFromToday(iso: string | null): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisYearOccur = new Date(now.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((thisYearOccur.getTime() - todayMidnight.getTime()) / 86400000);
  const abs = Math.abs(diff);
  return Math.min(abs, 365 - abs);
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
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [filterUnit, setFilterUnit] = useState<string | null>(null);
  const [filterPerformer, setFilterPerformer] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortDesc, setSortDesc] = useState(true); // 日付順 ala app (default terbaru dulu)
  const router = useRouter();
  const { lang } = useLanguage();
  const tr = (jp: string, id: string) => (lang === "jp" ? jp : id);

  const videos = data?.sukukoneVideos?.nodes ?? [];

  const handleTabClick = (id: TabId) => {
    setActiveTab(id);
    setFilterUnit(null);
    setFilterPerformer(null);
  };

  const tabBar = (
    <div className="flex overflow-x-auto scrollbar-hide">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`shrink-0 flex flex-col items-center gap-0.5 px-3.5 py-2 text-[10px] font-bold tracking-wide transition-all duration-150 border-b-2 cursor-pointer ${
            activeTab === tab.id
              ? "border-[var(--feature-sukukone-1)]"
              : "text-text-dim border-transparent hover:text-foreground hover:border-border"
          }`}
          style={activeTab === tab.id ? { color: "var(--feature-text)" } : undefined}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {TAB_ICONS[tab.id]}
          </svg>
          {tab.label}
        </button>
      ))}
    </div>
  );

  // ── Channel selector (poin 9 — gaya YouTube Subscriptions) ──
  const channelUnits = collectUnits(videos);
  const channelSelector = (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3 mb-4 border-b border-border">
      <ChannelChip
        label={tr("すべて", "Semua")}
        emoji="🎬"
        active={selectedChannel === "all"}
        onClick={() => setSelectedChannel("all")}
      />
      {channelUnits.map((u) => (
        <ChannelChip
          key={u.title}
          label={u.title}
          color={u.color}
          logo={u.logo}
          active={selectedChannel === u.title}
          onClick={() => setSelectedChannel(u.title)}
        />
      ))}
    </div>
  );

  const channelVideos =
    selectedChannel === "all"
      ? videos
      : videos.filter((v) => unitOf(v)?.title === selectedChannel);

  // ── WithxMEMORIES: video yang dulu tayang di sekitar tanggal hari ini (poin 11) ──
  const memorizeVideos = videos
    .map((v) => ({ v, dist: dayDistanceFromToday(v.sukukoneVideoDetails.airDate) }))
    .filter((x) => x.dist !== null && x.dist <= MEMORIZE_WINDOW_DAYS)
    .sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0))
    .map((x) => x.v);

  // ── Filter bar untuk tab konten (poin 10) ──
  const filterBar = (tabVids: SukukoneNode[]) => {
    const units = collectUnits(tabVids);
    const performers = collectPerformers(tabVids);
    if (units.length === 0 && performers.length === 0) return null;
    return (
      <div className="space-y-2 mb-4">
        {units.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <FilterChip label={tr("全ユニット", "Semua Unit")} active={!filterUnit} onClick={() => setFilterUnit(null)} />
            {units.map((u) => (
              <FilterChip
                key={u.title}
                label={u.title}
                color={u.color}
                active={filterUnit === u.title}
                onClick={() => setFilterUnit(filterUnit === u.title ? null : u.title)}
              />
            ))}
          </div>
        )}
        {performers.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <FilterChip label={tr("全メンバー", "Semua Anggota")} active={!filterPerformer} onClick={() => setFilterPerformer(null)} small />
            {performers.map((p) => (
              <FilterChip
                key={p.slug}
                label={p.title}
                active={filterPerformer === p.slug}
                onClick={() => setFilterPerformer(filterPerformer === p.slug ? null : p.slug)}
                small
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const grid = (list: SukukoneNode[], variant: "list" | "card", cols: 2 | 3) =>
    variant === "list" ? (
      <div className="space-y-3">
        {list.map((v) => (
          <VideoCard key={v.databaseId} video={v} />
        ))}
      </div>
    ) : (
      <div className={`grid gap-4 ${cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {list.map((v) => (
          <VideoCard key={v.databaseId} video={v} card />
        ))}
      </div>
    );

  const renderBody = (variant: "list" | "card", cols: 2 | 3) => {
    if (loading) {
      return variant === "list" ? (
        <div className="space-y-3"><VideoListSkeleton /></div>
      ) : (
        <div className={`grid gap-4 ${cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          <VideoListSkeleton grid />
        </div>
      );
    }
    if (error) {
      return (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          <p className="font-medium">{tr("データ取得エラー", "Gagal mengambil data")}</p>
          <p className="mt-1 text-xs opacity-70">{error.message}</p>
        </div>
      );
    }

    const cfg = TABS.find((t) => t.id === activeTab)!;

    // Upcoming / Ranking — jendela sendiri dengan pesan (poin 7 & 8)
    if (cfg.emptyMsg) return <EmptyState message={tr(cfg.emptyMsg.jp, cfg.emptyMsg.id)} />;

    // WithxMEMORIES — video yang dulu tayang dekat tanggal hari ini (poin 11)
    if (activeTab === "memorize") {
      const today = new Date();
      const tm = today.getMonth() + 1;
      const td = today.getDate();
      return (
        <>
          <p className="text-xs text-text-dim mb-4 flex items-center gap-1.5">
            <span aria-hidden>🕯️</span>
            {tr(
              `今日（${tm}月${td}日）前後に配信された思い出のスクコネ`,
              `Kenangan SukuKone yang pernah tayang sekitar hari ini (${tm}/${td})`
            )}
          </p>
          {memorizeVideos.length === 0 ? (
            <EmptyState
              message={tr(
                "今日の前後に配信された思い出はまだありません。",
                "Belum ada kenangan yang tayang di sekitar hari ini."
              )}
            />
          ) : (
            grid(memorizeVideos, variant, cols)
          )}
        </>
      );
    }

    // Channel — selector logo + video channel terpilih (poin 9)
    if (activeTab === "channel") {
      return (
        <>
          {channelSelector}
          {channelVideos.length === 0 ? (
            <NoContent message={tr("CHANNELのコンテンツはまだありません", "Belum ada konten CHANNEL")} />
          ) : (
            grid(channelVideos, variant, cols)
          )}
        </>
      );
    }

    // Tab konten — sort 日付順 (ala app) + filter + grid (poin 10)
    const tabVids = filterByTab(videos, activeTab);
    const filtered = [...applyFilters(tabVids, filterUnit, filterPerformer)].sort((a, b) => {
      const ta = a.sukukoneVideoDetails.airDate ? new Date(a.sukukoneVideoDetails.airDate).getTime() : 0;
      const tb = b.sukukoneVideoDetails.airDate ? new Date(b.sukukoneVideoDetails.airDate).getTime() : 0;
      return sortDesc ? tb - ta : ta - tb;
    });
    return (
      <>
        {/* Baris alat ala app: ♫ label + sort 日付順 */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: "var(--feature-text)" }}>
            <span aria-hidden>♫</span> {cfg.label}
          </span>
          <button
            onClick={() => setSortDesc(!sortDesc)}
            className="inline-flex items-center gap-1 rounded-full bg-white border border-[var(--linkura-border)] px-2.5 py-1 text-[10px] font-bold text-slate-600 shadow-sm active:scale-95 transition cursor-pointer"
            aria-label={tr("並び替え", "Urutkan")}
          >
            {tr("日付順", "Urut tanggal")} <span aria-hidden>{sortDesc ? "↓" : "↑"}</span>
          </button>
        </div>
        {filterBar(tabVids)}
        {filtered.length === 0 ? (
          <NoContent
            message={tr(`${cfg.label}のコンテンツはまだありません`, `Belum ada konten ${cfg.label}`)}
          />
        ) : (
          grid(filtered, variant, cols)
        )}
      </>
    );
  };

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={videos.length} unitLabel="スクコネ" />

        <header className="feature-band-sukukone px-3 py-2.5 shadow-sm">
          <h1 className="text-base font-bold text-white drop-shadow tracking-wide">
            {tr("スクールアイドルコネクト", "School Idol Connect")}
          </h1>
        </header>

        <div className="bg-white/90 border-b border-[var(--linkura-border)]">{tabBar}</div>

        <main className="flex-1 px-3 pt-3 pb-20 overflow-y-auto">
          {renderBody("card", 2)}
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
        <header className="feature-band-sukukone px-6 py-3 shadow-sm">
          <h1 className="text-xl font-bold text-white drop-shadow tracking-wide">
            {tr("スクールアイドルコネクト", "School Idol Connect")}
          </h1>
        </header>

        <div className="bg-white/90 border-b border-[var(--linkura-border)]">{tabBar}</div>

        <main className="flex-1 px-6 pt-4 pb-6 overflow-y-auto">
          {renderBody("card", 2)}
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <header className="feature-band-sukukone">
          <div className="max-w-5xl mx-auto w-full px-8 py-3.5">
            <h1 className="text-2xl font-bold text-white drop-shadow tracking-wide">
              {tr("スクールアイドルコネクト", "School Idol Connect")}
            </h1>
          </div>
        </header>

        <div className="bg-white/90 border-b border-[var(--linkura-border)]">
          <div className="max-w-5xl mx-auto w-full px-8">{tabBar}</div>
        </div>

        <main className="max-w-5xl mx-auto w-full px-8 pt-4 pb-8 flex-1">
          {renderBody("card", 3)}
        </main>
      </div>
    </>
  );
}

/* ── Sub-components ── */

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center text-3xl mb-4">
        📭
      </div>
      <p className="text-sm text-text-dim max-w-xs leading-relaxed">{message}</p>
    </div>
  );
}

function NoContent({ message }: { message: string }) {
  return (
    <div className="py-12 text-center text-text-dim text-sm">
      {message}
    </div>
  );
}

function ChannelChip({
  label,
  color,
  logo,
  emoji,
  active,
  onClick,
}: {
  label: string;
  color?: string;
  logo?: string | null;
  emoji?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="shrink-0 flex flex-col items-center gap-1.5 w-16 cursor-pointer">
      <div
        className={`w-14 h-14 rounded-full overflow-hidden flex items-center justify-center ring-2 transition ${
          active ? "ring-primary scale-105" : "ring-transparent hover:ring-border"
        }`}
        style={{ background: color ? `${color}20` : "var(--linkura-surface-2)" }}
      >
        {logo ? (
          <Image src={logo} alt={label} width={56} height={56} className="object-cover w-full h-full" />
        ) : emoji ? (
          <span className="text-2xl" aria-hidden>{emoji}</span>
        ) : (
          <span className="text-lg font-bold" style={{ color }}>
            {label.charAt(0)}
          </span>
        )}
      </div>
      <span
        className={`text-[10px] text-center leading-tight line-clamp-2 ${
          active ? "text-primary font-bold" : "text-text-dim"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function FilterChip({
  label,
  color,
  active,
  onClick,
  small,
}: {
  label: string;
  color?: string;
  active: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  // warna unit terang (Edel Note putih): teks gelap + tepi agar chip aktif terbaca
  const c = color ? unitDisplayColors(color) : null;
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full font-medium transition cursor-pointer border ${
        small ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
      } ${
        active
          ? c?.isLight ? "" : "text-white border-transparent"
          : "text-text-dim border-border hover:border-primary/40 hover:text-foreground bg-white"
      }`}
      style={
        active
          ? c?.isLight
            ? { background: c.color, color: "#475569", borderColor: "#cbd5e1" }
            : { background: color || "var(--linkura-primary)" }
          : undefined
      }
    >
      {label}
    </button>
  );
}

function VideoCard({
  video,
  card,
}: {
  video: SukukoneNode;
  card?: boolean;
}) {
  const d = video.sukukoneVideoDetails;
  const unitColor = unitOf(video)?.unitDetails.colorPrimary || "var(--linkura-primary)";
  const type = d.tabType?.[0];
  const thumbUrl = d.thumbnail?.node.sourceUrl;

  if (card) {
    return (
      <Link
        href={`/sukukone/${video.slug}`}
        className="group block rounded-xl overflow-hidden transition-all hover:shadow-lg"
        style={{ background: "var(--linkura-surface)", border: "1px solid var(--linkura-border)" }}
      >
        <div className="relative aspect-video" style={{ background: `${unitColor}15` }}>
          {thumbUrl ? (
            <Image src={thumbUrl} alt={video.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
          ) : d.youtubeVideoId ? (
            <Image
              src={`https://img.youtube.com/vi/${d.youtubeVideoId}/mqdefault.jpg`}
              alt={video.title}
              fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl opacity-30">🎤</span>
            </div>
          )}

          <span
            className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white"
            style={{ background: unitColor }}
          >
            {tabTypeLabel(type)}
          </span>

          {d.durationSeconds && (
            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white tabular-nums">
              {formatDuration(d.durationSeconds)}
            </span>
          )}

          {/* Tanggal overlay di thumbnail (ala app n04_archives) */}
          {d.airDate && (
            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/55 text-[10px] font-medium text-white tabular-nums">
              {formatDate(d.airDate)}
            </span>
          )}
        </div>

        <div className="p-2.5">
          <h3 className="font-semibold text-[12px] leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/sukukone/${video.slug}`}
      className="group flex gap-3 p-2 rounded-xl transition-all hover:shadow-md"
      style={{ background: "var(--linkura-surface)", border: "1px solid var(--linkura-border)" }}
    >
      <div className="relative w-32 shrink-0 aspect-video rounded-lg overflow-hidden" style={{ background: `${unitColor}15` }}>
        {thumbUrl ? (
          <Image src={thumbUrl} alt={video.title} fill sizes="128px" className="object-cover" />
        ) : d.youtubeVideoId ? (
          <Image
            src={`https://img.youtube.com/vi/${d.youtubeVideoId}/mqdefault.jpg`}
            alt={video.title}
            fill sizes="128px" className="object-cover"
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
