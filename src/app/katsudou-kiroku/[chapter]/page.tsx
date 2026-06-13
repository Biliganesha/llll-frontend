"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useLanguage } from "@/lib/language";
import { CHAPTER_FIELDS, type ChapterNode } from "@/graphql/fragments/chapter";
import { EPISODE_FIELDS, type EpisodeStructure } from "@/graphql/fragments/episode";
import { StoryDigestModal } from "@/components/katsudou/StoryDigestModal";

const GET_CHAPTER = gql`
  ${CHAPTER_FIELDS}
  ${EPISODE_FIELDS}
  query GetChapter($slug: ID!) {
    storyChapter(id: $slug, idType: SLUG) {
      ...ChapterFields
    }
    episodes(first: 100) {
      nodes {
        ...EpisodeFields
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
    youtubeVideoId: string | null;
    durationSeconds: number | null;
    summaryJp: string | null;
    summaryId: string | null;
  };
  episodeStructure: EpisodeStructure;
};

type QueryData = {
  storyChapter: ChapterNode | null;
  episodes: { nodes: EpisodeNode[] };
};

const ALL_GENERATIONS = ["102", "103", "104", "105"];

function genOf(ep: EpisodeNode): string | null {
  return ep.episodeStructure?.generation?.[0] ?? null;
}
function monthOf(ep: EpisodeNode): string | null {
  return ep.episodeStructure?.storyMonth ?? null;
}
function chapterSlugOf(ep: EpisodeNode): string | null {
  return ep.episodeStructure?.chapter?.nodes?.[0]?.slug ?? null;
}

export default function ChapterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chapterSlug = params.chapter as string;
  const [menuOpen, setMenuOpen] = useState(false);
  const [digestOpen, setDigestOpen] = useState(false);
  const [selectedGen, setSelectedGen] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const { lang } = useLanguage();
  const tr = (jp: string, id: string) => (lang === "jp" ? jp : id);

  const { data, loading, error } = useQuery<QueryData>(GET_CHAPTER, {
    variables: { slug: chapterSlug },
  });

  const chapter = data?.storyChapter ?? null;
  const allEpisodes = (data?.episodes?.nodes ?? []).filter(
    (ep) => chapterSlugOf(ep) === chapterSlug
  );

  // urutkan by chapterOrder lalu episodeNumber
  const ordered = [...allEpisodes].sort((a, b) => {
    const ao = a.episodeStructure?.chapterOrder ?? a.episodeDetails.episodeNumber ?? 0;
    const bo = b.episodeStructure?.chapterOrder ?? b.episodeDetails.episodeNumber ?? 0;
    return ao - bo;
  });

  const presentGens = ALL_GENERATIONS.filter((g) => ordered.some((ep) => genOf(ep) === g));
  const presentMonths = [...new Set(ordered.map(monthOf).filter(Boolean))] as string[];

  const filtered = ordered.filter(
    (ep) =>
      (!selectedGen || genOf(ep) === selectedGen) &&
      (!selectedMonth || monthOf(ep) === selectedMonth)
  );

  // → NOW: episode terdekat real-time = rilis terakhir yang ≤ hari ini (fallback: episode terakhir).
  const today = new Date();
  const nowEpisode =
    [...ordered]
      .filter((ep) => ep.episodeDetails.releaseDate && new Date(ep.episodeDetails.releaseDate) <= today)
      .sort(
        (a, b) =>
          new Date(b.episodeDetails.releaseDate as string).getTime() -
          new Date(a.episodeDetails.releaseDate as string).getTime()
      )[0] ||
    ordered[ordered.length - 1] ||
    null;

  const color = chapter?.chapterDetails.colorTheme || "var(--linkura-primary)";
  const label =
    lang === "jp"
      ? chapter?.chapterDetails.chapterLabelJp
      : chapter?.chapterDetails.chapterLabelId || chapter?.chapterDetails.chapterLabelJp;
  const desc =
    lang === "jp"
      ? chapter?.chapterDetails.descriptionJp
      : chapter?.chapterDetails.descriptionId || chapter?.chapterDetails.descriptionJp;

  const body = (
    <>
      <Link href="/katsudou-kiroku" className="text-xs text-text-dim hover:underline">
        {tr("← 活動記録", "← Catatan Aktivitas")}
      </Link>

      {loading ? (
        <div className="py-16 text-center text-text-dim text-sm animate-pulse">{tr("読み込み中...", "Memuat...")}</div>
      ) : error ? (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error.message}
        </div>
      ) : !chapter ? (
        <div className="py-16 text-center text-text-dim text-sm">{tr("章が見つかりません。", "Bab tidak ditemukan.")}</div>
      ) : (
        <>
          {/* Chapter header */}
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white"
                style={{ background: color }}
              >
                {chapter.chapterDetails.chapterType === "interlude" ? "間章" : "章"}
              </span>
              <h1 className="text-2xl font-extrabold leading-tight">{chapter.title}</h1>
            </div>
            {label && <p className="text-sm font-medium mt-0.5" style={{ color }}>{label}</p>}
            {desc && <p className="text-sm text-foreground/75 leading-relaxed mt-2">{desc}</p>}
          </div>

          {/* Generation timeline (102 → 105) */}
          <div className="mt-5">
            <p className="text-[11px] font-bold text-text-dim mb-2 uppercase tracking-wider">{tr("期", "Angkatan")}</p>
            <div className="flex items-center overflow-x-auto scrollbar-hide pb-1">
              {ALL_GENERATIONS.map((g, i) => {
                const present = presentGens.includes(g);
                const active = selectedGen === g;
                return (
                  <div key={g} className="flex items-center shrink-0">
                    <button
                      disabled={!present}
                      onClick={() => setSelectedGen(active ? null : g)}
                      className={`flex flex-col items-center gap-1 transition ${
                        present ? "cursor-pointer" : "opacity-30 cursor-not-allowed"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border-2 transition"
                        style={{
                          borderColor: present ? color : "var(--linkura-border)",
                          background: active ? color : "transparent",
                        }}
                      />
                      <span
                        className={`text-xs font-bold ${active ? "" : "text-text-dim"}`}
                        style={active ? { color } : undefined}
                      >
                        {g}期
                      </span>
                    </button>
                    {i < ALL_GENERATIONS.length - 1 && (
                      <span className="w-8 h-0.5 mb-5 bg-border" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Month timeline */}
          {presentMonths.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-bold text-text-dim mb-2 uppercase tracking-wider">{tr("月", "Bulan")}</p>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {presentMonths.map((m) => {
                  const active = selectedMonth === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setSelectedMonth(active ? null : m)}
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                        active ? "text-white border-transparent" : "text-text-dim border-border hover:text-foreground"
                      }`}
                      style={active ? { background: color } : undefined}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Episodes — horizontal big-image cards */}
          <div className="mt-5">
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-text-dim text-sm">
                {tr("該当するエピソードがありません。", "Tidak ada episode yang cocok.")}
              </p>
            ) : (
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 -mx-1 px-1">
                {filtered.map((ep) => (
                  <EpisodeBigCard key={ep.databaseId} episode={ep} accent={color} />
                ))}
              </div>
            )}
          </div>

          {/* Aksi ala app: Story Digest (kiri) + → NOW (kanan) */}
          {ordered.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setDigestOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-white shadow-sm hover:opacity-90 transition"
                style={{ background: "linear-gradient(135deg,#6a7bff,#a88dff)" }}
              >
                🎬 {tr("ストーリーダイジェスト", "Story Digest")}
              </button>
              <div className="flex-1" />
              {nowEpisode && (
                <button
                  onClick={() => router.push(`/katsudou-kiroku/ep/${nowEpisode.slug}`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition hover:bg-surface-2"
                  style={{ borderColor: color, color }}
                >
                  {tr("最新へ", "Terbaru")} <span aria-hidden>→ NOW</span>
                </button>
              )}
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={filtered.length} unitLabel={tr("活動記録", "Catatan Aktivitas")} />
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
        <main className="flex-1 px-6 py-6 max-w-3xl mx-auto w-full">{body}</main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <main className="max-w-4xl mx-auto w-full px-8 py-8 flex-1">{body}</main>
      </div>

      <StoryDigestModal open={digestOpen} onClose={() => setDigestOpen(false)} />
    </>
  );
}

function EpisodeBigCard({ episode, accent }: { episode: EpisodeNode; accent: string }) {
  const { lang } = useLanguage();
  const hero =
    episode.episodeStructure?.heroImage?.node.sourceUrl ||
    (episode.episodeDetails.youtubeVideoId
      ? `https://img.youtube.com/vi/${episode.episodeDetails.youtubeVideoId}/mqdefault.jpg`
      : null);
  const gen = episode.episodeStructure?.generation?.[0];
  const month = episode.episodeStructure?.storyMonth;
  const summary =
    lang === "jp"
      ? episode.episodeDetails.summaryJp
      : episode.episodeDetails.summaryId || episode.episodeDetails.summaryJp;

  return (
    <Link
      href={`/katsudou-kiroku/ep/${episode.slug}`}
      className="group shrink-0 w-64 sm:w-72 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all active:scale-[0.98]"
      style={{ border: "1px solid var(--linkura-border)" }}
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        {hero ? (
          <Image
            src={hero}
            alt={episode.title}
            fill
            sizes="288px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}55)` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {(gen || month) && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: accent }}>
            {gen ? `${gen}期` : ""}{gen && month ? " · " : ""}{month ?? ""}
          </span>
        )}

        <div className="absolute bottom-2 left-3 right-3">
          <h3 className="text-sm font-bold text-white drop-shadow leading-tight line-clamp-2">
            {episode.title}
          </h3>
        </div>
      </div>
      {summary && (
        <div className="px-3 py-2 bg-white">
          <p className="text-[11px] text-foreground/70 leading-snug line-clamp-2">
            {summary}
          </p>
        </div>
      )}
    </Link>
  );
}
