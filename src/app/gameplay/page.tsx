"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTr } from "@/lib/language";

const GET_GAMEPLAY = gql`
  query GetGameplayArchives {
    gameplayArchives(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        databaseId
        title
        slug
        gameplayArchiveDetails {
          archiveDate
          eventType
          sourceQuality
          youtubeVideoId
          summaryJp
          screenshot {
            node {
              sourceUrl
              altText
            }
          }
          relatedCharacters {
            nodes {
              ... on Character {
                title
                characterDetails {
                  nameJp
                  colorTheme
                }
              }
            }
          }
        }
      }
    }
  }
`;

type GameplayNode = {
  databaseId: number;
  title: string;
  slug: string;
  gameplayArchiveDetails: {
    archiveDate: string | null;
    eventType: string[] | null;
    sourceQuality: string[] | null;
    youtubeVideoId: string | null;
    summaryJp: string | null;
    screenshot: { node: { sourceUrl: string; altText: string } } | null;
    relatedCharacters: {
      nodes: { title: string; characterDetails: { nameJp: string; colorTheme: string | null } }[];
    } | null;
  };
};

type QueryData = { gameplayArchives: { nodes: GameplayNode[] } };

type EventFilter = "all" | "story_event" | "ranking_event" | "gacha" | "live_show" | "campaign" | "ui_walkthrough" | "other";

const EVENT_TYPES: { id: EventFilter; label: string; labelId: string }[] = [
  { id: "all", label: "すべて", labelId: "Semua" },
  { id: "story_event", label: "ストーリー", labelId: "Cerita" },
  { id: "ranking_event", label: "ランキング", labelId: "Ranking" },
  { id: "gacha", label: "ガチャ", labelId: "Gacha" },
  { id: "live_show", label: "ライブ", labelId: "Live" },
  { id: "campaign", label: "キャンペーン", labelId: "Kampanye" },
  { id: "ui_walkthrough", label: "UI", labelId: "UI" },
  { id: "other", label: "その他", labelId: "Lainnya" },
];

function eventTypeLabel(type: string | undefined): string {
  const found = EVENT_TYPES.find((e) => e.id === type);
  return found?.label || "その他";
}

function qualityLabel(q: string | undefined): string {
  switch (q) {
    case "raw": return "Raw";
    case "screen_record": return "Screen Record";
    case "compressed": return "Compressed";
    case "screenshot_only": return "Screenshot";
    default: return "";
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

function GameplayCard({ item, card }: { item: GameplayNode; card?: boolean }) {
  const d = item.gameplayArchiveDetails;
  const eventType = d.eventType?.[0];
  const quality = d.sourceQuality?.[0];
  const thumbUrl = d.screenshot?.node.sourceUrl;
  const characters = d.relatedCharacters?.nodes ?? [];

  const eventColor = eventType === "story_event" ? "#8b82f5"
    : eventType === "ranking_event" ? "#ef5a8f"
    : eventType === "gacha" ? "#f59e0b"
    : eventType === "live_show" ? "#3b82f6"
    : "#786e95";

  if (card) {
    return (
      <div className="rounded-xl overflow-hidden border border-border bg-surface">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-surface-2">
          {thumbUrl ? (
            <img src={thumbUrl} alt={item.title} className="w-full h-full object-cover" />
          ) : d.youtubeVideoId ? (
            <img
              src={`https://img.youtube.com/vi/${d.youtubeVideoId}/mqdefault.jpg`}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl opacity-30">🎮</span>
            </div>
          )}

          <span
            className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white"
            style={{ background: eventColor }}
          >
            {eventTypeLabel(eventType)}
          </span>

          {quality && (
            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white">
              {qualityLabel(quality)}
            </span>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {item.title}
          </h3>
          <p className="text-[11px] text-text-dim mt-1">{formatDate(d.archiveDate)}</p>

          {characters.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {characters.slice(0, 3).map((ch, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                  style={{
                    background: `${ch.characterDetails.colorTheme || "#8b82f5"}15`,
                    color: ch.characterDetails.colorTheme || "#8b82f5",
                  }}
                >
                  {ch.characterDetails.nameJp}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // List variant (phone)
  return (
    <div className="flex gap-3 p-2 rounded-xl border border-border bg-surface">
      <div className="relative w-28 shrink-0 aspect-video rounded-lg overflow-hidden bg-surface-2">
        {thumbUrl ? (
          <img src={thumbUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : d.youtubeVideoId ? (
          <img
            src={`https://img.youtube.com/vi/${d.youtubeVideoId}/mqdefault.jpg`}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl opacity-30">🎮</span>
          </div>
        )}

        <span
          className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
          style={{ background: eventColor }}
        >
          {eventTypeLabel(eventType)}
        </span>
      </div>

      <div className="flex-1 min-w-0 py-0.5">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">{item.title}</h3>
        <p className="text-[11px] text-text-dim mt-1">{formatDate(d.archiveDate)}</p>
      </div>
    </div>
  );
}

export default function GameplayPage() {
  const { data, loading } = useQuery<QueryData>(GET_GAMEPLAY);
  const router = useRouter();
  const tr = useTr();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<EventFilter>("all");

  const allItems = data?.gameplayArchives.nodes ?? [];
  const filtered = filter === "all" ? allItems : allItems.filter((g) => g.gameplayArchiveDetails.eventType?.[0] === filter);

  const filterChips = (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-3">
      {EVENT_TYPES.map((et) => {
        const count = et.id === "all" ? allItems.length : allItems.filter((g) => g.gameplayArchiveDetails.eventType?.[0] === et.id).length;
        if (et.id !== "all" && count === 0) return null;
        return (
          <button
            key={et.id}
            onClick={() => setFilter(et.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              filter === et.id
                ? "bg-primary text-white"
                : "bg-surface-2 text-text-dim hover:bg-border"
            }`}
          >
            {tr(et.label, et.labelId)} ({count})
          </button>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-text-dim">{tr("読み込み中...", "Memuat...")}</div>
      </div>
    );
  }

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={allItems.length} unitLabel={tr("ゲームプレイ", "Gameplay")} />
        <main className="flex-1 px-3 pt-3 pb-20 overflow-y-auto">
          <h1 className="text-xl font-bold brand-gradient-text mb-3">{tr("ゲームプレイアーカイブ", "Arsip Gameplay")}</h1>
          {filterChips}
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-text-dim text-sm">
              {tr("アーカイブはまだありません", "Belum ada arsip")}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((g) => <GameplayCard key={g.databaseId} item={g} />)}
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
        <main className="flex-1 px-6 py-6">
          <h1 className="text-2xl font-bold brand-gradient-text mb-4">{tr("ゲームプレイアーカイブ", "Arsip Gameplay")}</h1>
          {filterChips}
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-text-dim text-sm">
              {tr("アーカイブはまだありません", "Belum ada arsip")}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map((g) => <GameplayCard key={g.databaseId} item={g} card />)}
            </div>
          )}
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <main className="max-w-5xl mx-auto w-full px-8 py-8">
          <h1 className="text-3xl font-bold brand-gradient-text mb-4">{tr("ゲームプレイアーカイブ", "Arsip Gameplay")}</h1>
          {filterChips}
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-text-dim text-sm">
              {tr("アーカイブはまだありません", "Belum ada arsip")}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {filtered.map((g) => <GameplayCard key={g.databaseId} item={g} card />)}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
