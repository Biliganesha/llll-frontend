"use client";

import { useState, useMemo } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTr } from "@/lib/language";

const GET_CALENDAR_DATA = gql`
  query GetCalendarData {
    episodes(first: 500) {
      nodes {
        databaseId
        title
        slug
        episodeDetails {
          releaseDate
          episodeNumber
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

type CalendarEvent = {
  date: Date;
  monthDay: string; // "MM-DD" for cross-year matching
  title: string;
  type: "episode" | "sukukone" | "birthday";
  year: number;
  href: string;
  color?: string;
};

type QueryData = {
  episodes: {
    nodes: {
      databaseId: number;
      title: string;
      slug: string;
      episodeDetails: { releaseDate: string | null; episodeNumber: number | null };
    }[];
  };
  sukukoneVideos: {
    nodes: {
      databaseId: number;
      title: string;
      slug: string;
      sukukoneVideoDetails: { airDate: string | null; tabType: string[] | null };
    }[];
  };
  characters: {
    nodes: {
      databaseId: number;
      title: string;
      slug: string;
      characterDetails: { nameJp: string; birthday: string | null; colorTheme: string | null };
    }[];
  };
};

/** Parse JP birthday "5月22日" → { month: 5, day: 22 } */
function parseBirthday(bday: string | null): { month: number; day: number } | null {
  if (!bday) return null;
  const m = bday.match(/(\d+)月(\d+)日/);
  if (!m) return null;
  return { month: parseInt(m[1]), day: parseInt(m[2]) };
}

const MONTH_NAMES = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

function buildEvents(data: QueryData | undefined): CalendarEvent[] {
  if (!data) return [];
  const events: CalendarEvent[] = [];

  // Episodes
  for (const ep of data.episodes.nodes) {
    if (!ep.episodeDetails.releaseDate) continue;
    const d = new Date(ep.episodeDetails.releaseDate);
    events.push({
      date: d,
      monthDay: `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      title: ep.title,
      type: "episode",
      year: d.getFullYear(),
      href: `/katsudou-kiroku/ep/${ep.slug}`,
      color: "#8b82f5",
    });
  }

  // Sukukone
  for (const sv of data.sukukoneVideos.nodes) {
    if (!sv.sukukoneVideoDetails.airDate) continue;
    const d = new Date(sv.sukukoneVideoDetails.airDate);
    events.push({
      date: d,
      monthDay: `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      title: sv.title,
      type: "sukukone",
      year: d.getFullYear(),
      href: `/sukukone`,
      color: "#ef5a8f",
    });
  }

  // Birthdays (recurring every year)
  for (const ch of data.characters.nodes) {
    const bd = parseBirthday(ch.characterDetails.birthday);
    if (!bd) continue;
    events.push({
      date: new Date(2000, bd.month - 1, bd.day),
      monthDay: `${String(bd.month).padStart(2, "0")}-${String(bd.day).padStart(2, "0")}`,
      title: `🎂 ${ch.characterDetails.nameJp} 誕生日`,
      type: "birthday",
      year: 0, // recurring
      href: `/characters/${ch.slug}`,
      color: ch.characterDetails.colorTheme || "#ffb74d",
    });
  }

  return events;
}

export default function CalendarPage() {
  const { data, loading } = useQuery<QueryData>(GET_CALENDAR_DATA);
  const router = useRouter();
  const tr = useTr();

  const today = new Date();
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const allEvents = useMemo(() => buildEvents(data), [data]);

  // "Hari ini di 蓮ノ空" — events that match today's month/day across all years
  const todayMD = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const todayEvents = allEvents.filter((e) => e.monthDay === todayMD);

  // Events for the current view month
  const monthEvents = allEvents.filter((e) => {
    if (e.type === "birthday") {
      return e.date.getMonth() === viewMonth;
    }
    return e.date.getMonth() === viewMonth && e.date.getFullYear() === viewYear;
  });

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1);
  const startDow = firstDay.getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  function eventsForDay(day: number) {
    const md = `${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return allEvents.filter((e) => {
      if (e.type === "birthday") return e.monthDay === md;
      return e.monthDay === md && e.year === viewYear;
    });
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const todayWidget = todayEvents.length > 0 && (
    <div className="rounded-xl p-4 mb-4" style={{ background: "linear-gradient(135deg, #fff0f5, #f0eaff)" }}>
      <h2 className="text-sm font-bold brand-gradient-text mb-2">
        {tr(
          `今日の蓮ノ空 — ${today.getMonth() + 1}月${today.getDate()}日`,
          `Hari Ini di 蓮ノ空 — ${today.getMonth() + 1}/${today.getDate()}`
        )}
      </h2>
      <div className="space-y-1.5">
        {todayEvents.map((e, i) => (
          <Link
            key={i}
            href={e.href}
            className="flex items-center gap-2 text-xs hover:underline"
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: e.color }} />
            <span>{e.year > 0 ? `${e.year}年 ` : ""}{e.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  const calendarGrid = (
    <div>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="px-3 py-1 rounded-lg text-sm hover:bg-surface-2 cursor-pointer">←</button>
        <h2 className="text-base font-bold">
          {viewYear}年 {MONTH_NAMES[viewMonth]}
        </h2>
        <button onClick={nextMonth} className="px-3 py-1 rounded-lg text-sm hover:bg-surface-2 cursor-pointer">→</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center text-[10px] text-text-dim mb-1">
        {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const dayEvents = eventsForDay(day);
          const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

          return (
            <div
              key={day}
              className={`relative min-h-[40px] p-1 rounded-lg text-xs ${
                isToday ? "ring-2 ring-primary bg-primary/5" : ""
              } ${dayEvents.length > 0 ? "bg-surface" : ""}`}
            >
              <span className={`${isToday ? "font-bold text-primary" : "text-text-dim"}`}>
                {day}
              </span>
              {/* Event dots */}
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap">
                  {dayEvents.slice(0, 3).map((e, j) => (
                    <span
                      key={j}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: e.color }}
                      title={e.title}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const eventsList = (
    <div className="mt-4">
      <h3 className="text-sm font-bold text-text-dim mb-2">
        {MONTH_NAMES[viewMonth]}のイベント ({monthEvents.length})
      </h3>
      {monthEvents.length === 0 ? (
        <p className="text-xs text-text-dim">この月のイベントはありません</p>
      ) : (
        <div className="space-y-1.5">
          {monthEvents
            .sort((a, b) => parseInt(a.monthDay.split("-")[1]) - parseInt(b.monthDay.split("-")[1]))
            .map((e, i) => (
              <Link
                key={i}
                href={e.href}
                className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-surface-2 transition-colors"
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: e.color }} />
                <span className="text-text-dim w-10 shrink-0">
                  {e.monthDay.split("-")[1]}日
                </span>
                <span className="flex-1 truncate">{e.title}</span>
                <span className="text-[10px] text-text-dim/60">
                  {e.type === "episode" ? "活動記録" : e.type === "sukukone" ? "スクコネ" : "🎂"}
                </span>
              </Link>
            ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-text-dim">読み込み中...</div>
      </div>
    );
  }

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen wallpaper-default relative">
        <StatusBar episodeCount={0} unitLabel={tr("カレンダー", "Kalender")} />
        <main className="flex-1 px-3 pt-3 pb-20 overflow-y-auto">
          <h1 className="text-xl font-bold brand-gradient-text mb-3">{tr("カレンダー", "Kalender")}</h1>
          {todayWidget}
          {calendarGrid}
          {eventsList}
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
          <h1 className="text-2xl font-bold brand-gradient-text mb-4">{tr("カレンダー", "Kalender")}</h1>
          {todayWidget}
          <div className="flex gap-6">
            <div className="flex-1">{calendarGrid}</div>
            <div className="w-64 shrink-0">{eventsList}</div>
          </div>
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <main className="max-w-5xl mx-auto w-full px-8 py-8">
          <h1 className="text-3xl font-bold brand-gradient-text mb-4">{tr("カレンダー", "Kalender")}</h1>
          {todayWidget}
          <div className="flex gap-8">
            <div className="flex-1">{calendarGrid}</div>
            <div className="w-80 shrink-0">{eventsList}</div>
          </div>
        </main>
      </div>
    </>
  );
}
