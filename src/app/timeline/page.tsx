"use client";

import { useState, useMemo, useRef } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GET_TIMELINE_DATA = gql`
  query GetTimelineData {
    episodes(first: 500, where: { orderby: { field: DATE, order: ASC } }) {
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
          airDate
          tabType
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
          birthday
          colorTheme
        }
      }
    }
  }
`;

type TimelineEvent = {
  id: string;
  date: Date;
  dateStr: string;
  title: string;
  type: "episode" | "sukukone" | "birthday";
  href: string;
  color: string;
  meta?: string;
};

function parseBirthday(bday: string | null): { month: number; day: number } | null {
  if (!bday) return null;
  const m = bday.match(/(\d+)月(\d+)日/);
  if (!m) return null;
  return { month: parseInt(m[1]), day: parseInt(m[2]) };
}

function tabTypeLabel(type: string | undefined): string {
  switch (type) {
    case "with_meets": return "WithxMEETS";
    case "fes_live": return "FesxLIVE";
    case "with_station": return "WxSTATION";
    case "mv": return "MV";
    default: return "スクコネ";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildTimeline(data: any): TimelineEvent[] {
  if (!data) return [];
  const events: TimelineEvent[] = [];

  for (const ep of data.episodes.nodes) {
    if (!ep.episodeDetails.releaseDate) continue;
    const d = new Date(ep.episodeDetails.releaseDate);
    events.push({
      id: `ep-${ep.databaseId}`,
      date: d,
      dateStr: formatDateFull(d),
      title: ep.title,
      type: "episode",
      href: `/katsudou-kiroku/${ep.slug}`,
      color: "#8b82f5",
      meta: ep.episodeDetails.episodeNumber ? `#${ep.episodeDetails.episodeNumber}` : undefined,
    });
  }

  for (const sv of data.sukukoneVideos.nodes) {
    if (!sv.sukukoneVideoDetails.airDate) continue;
    const d = new Date(sv.sukukoneVideoDetails.airDate);
    events.push({
      id: `sk-${sv.databaseId}`,
      date: d,
      dateStr: formatDateFull(d),
      title: sv.title,
      type: "sukukone",
      href: `/sukukone/${sv.slug}`,
      color: "#ef5a8f",
      meta: tabTypeLabel(sv.sukukoneVideoDetails.tabType?.[0]),
    });
  }

  // Birthdays — add for each year that has content
  const years = new Set<number>();
  events.forEach((e) => years.add(e.date.getFullYear()));
  if (years.size === 0) years.add(new Date().getFullYear());

  for (const ch of data.characters.nodes) {
    const bd = parseBirthday(ch.characterDetails.birthday);
    if (!bd) continue;
    for (const year of years) {
      const d = new Date(year, bd.month - 1, bd.day);
      events.push({
        id: `bd-${ch.databaseId}-${year}`,
        date: d,
        dateStr: formatDateFull(d),
        title: `${ch.characterDetails.nameJp} 誕生日`,
        type: "birthday",
        href: `/characters/${ch.slug}`,
        color: ch.characterDetails.colorTheme || "#ffb74d",
      });
    }
  }

  events.sort((a, b) => a.date.getTime() - b.date.getTime());
  return events;
}

function formatDateFull(d: Date): string {
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

function formatMonthYear(d: Date): string {
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

type TypeFilter = "all" | "episode" | "sukukone" | "birthday";

const TYPE_FILTERS: { id: TypeFilter; label: string; color: string }[] = [
  { id: "all", label: "すべて", color: "#8b82f5" },
  { id: "episode", label: "活動記録", color: "#8b82f5" },
  { id: "sukukone", label: "スクコネ", color: "#ef5a8f" },
  { id: "birthday", label: "誕生日", color: "#ffb74d" },
];

export default function TimelinePage() {
  const { data, loading } = useQuery(GET_TIMELINE_DATA);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<TypeFilter>("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const allEvents = useMemo(() => buildTimeline(data), [data]);
  const filtered = filter === "all" ? allEvents : allEvents.filter((e) => e.type === filter);

  // Group by month
  const grouped = useMemo(() => {
    const groups: { label: string; events: TimelineEvent[] }[] = [];
    let currentLabel = "";
    for (const ev of filtered) {
      const label = formatMonthYear(ev.date);
      if (label !== currentLabel) {
        groups.push({ label, events: [ev] });
        currentLabel = label;
      } else {
        groups[groups.length - 1].events.push(ev);
      }
    }
    return groups;
  }, [filtered]);

  // Year quick-jump buttons
  const years = useMemo(() => {
    const s = new Set<number>();
    allEvents.forEach((e) => s.add(e.date.getFullYear()));
    return Array.from(s).sort();
  }, [allEvents]);

  const scrollToYear = (year: number) => {
    const el = document.getElementById(`year-${year}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filterChips = (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
      {TYPE_FILTERS.map((f) => {
        const count = f.id === "all" ? allEvents.length : allEvents.filter((e) => e.type === f.id).length;
        return (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              filter === f.id
                ? "text-white"
                : "bg-surface-2 text-text-dim hover:bg-border"
            }`}
            style={filter === f.id ? { background: f.color } : undefined}
          >
            {f.label} ({count})
          </button>
        );
      })}
    </div>
  );

  const yearJumps = years.length > 1 && (
    <div className="flex gap-1.5 mt-2">
      {years.map((y) => (
        <button
          key={y}
          onClick={() => scrollToYear(y)}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface border border-border text-text-dim hover:bg-surface-2 transition-colors cursor-pointer"
        >
          {y}
        </button>
      ))}
    </div>
  );

  const timelineView = loading ? (
    <div className="space-y-4 mt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="w-3 flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-border/40" />
            <div className="flex-1 w-0.5 bg-border/20" />
          </div>
          <div className="flex-1 p-3 rounded-xl bg-surface border border-border space-y-1.5">
            <div className="h-4 bg-border/40 rounded w-3/4" />
            <div className="h-3 bg-border/30 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  ) : filtered.length === 0 ? (
    <div className="mt-8 text-center">
      <span className="text-4xl">🕰️</span>
      <p className="text-sm text-text-dim mt-3">タイムラインにイベントがありません</p>
    </div>
  ) : (
    <div className="mt-4 relative" ref={scrollRef}>
      {/* Vertical line */}
      <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-border" />

      {grouped.map((group, gi) => {
        // Check if this is the first group of a new year
        const year = group.events[0]?.date.getFullYear();
        const prevYear = gi > 0 ? grouped[gi - 1].events[0]?.date.getFullYear() : null;
        const isNewYear = year !== prevYear;

        return (
          <div key={group.label}>
            {/* Year marker */}
            {isNewYear && (
              <div id={`year-${year}`} className="flex items-center gap-2 mb-3 mt-2 first:mt-0">
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-sm font-bold text-primary">{year}年</span>
              </div>
            )}

            {/* Month header */}
            <div className="flex items-center gap-2 ml-1 mb-2 mt-3">
              <span className="text-[11px] font-medium text-text-dim">{group.label}</span>
              <span className="text-[10px] text-text-dim/50">({group.events.length})</span>
            </div>

            {/* Events */}
            {group.events.map((ev) => (
              <div key={ev.id} className="flex gap-3 mb-2">
                {/* Dot */}
                <div className="w-[15px] shrink-0 flex justify-center pt-3 z-10">
                  <div
                    className="w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{ background: ev.color }}
                  />
                </div>

                {/* Card */}
                <Link
                  href={ev.href}
                  className="flex-1 p-3 rounded-xl border border-border bg-surface hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                        {ev.type === "birthday" ? `🎂 ${ev.title}` : ev.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-text-dim">{ev.dateStr}</span>
                        {ev.meta && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                            style={{ background: `${ev.color}15`, color: ev.color }}
                          >
                            {ev.meta}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className="shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                      style={{ background: ev.color }}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={allEvents.length} unitLabel="タイムライン" />
        <main className="flex-1 px-3 pt-3 pb-20 overflow-y-auto">
          <h1 className="text-xl font-bold brand-gradient-text mb-3">タイムライン</h1>
          {filterChips}
          {yearJumps}
          {timelineView}
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
        <main className="flex-1 px-6 py-6 max-w-2xl mx-auto w-full">
          <h1 className="text-2xl font-bold brand-gradient-text mb-4">タイムライン</h1>
          {filterChips}
          {yearJumps}
          {timelineView}
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <main className="max-w-3xl mx-auto w-full px-8 py-8">
          <h1 className="text-3xl font-bold brand-gradient-text mb-4">タイムライン</h1>
          <div className="flex items-center gap-4">
            {filterChips}
          </div>
          {yearJumps}
          {timelineView}
        </main>
      </div>
    </>
  );
}
