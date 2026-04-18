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

const GET_EPISODE = gql`
  query GetEpisode($slug: ID!) {
    episode(id: $slug, idType: SLUG) {
      databaseId
      title
      slug
      episodeDetails {
        releaseDate
        episodeNumber
        durationSeconds
        youtubeUrl
        youtubeVideoId
        summaryJp: ringkasanJp
        hasSubtitleJp: subtitleJpTersedia
        hasSubtitleId: subtitleIdTersedia
        originalSource: sumberAsliOfficialUrl
        archiveNotes: catatanArsipInternal
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
    hasSubtitleJp: boolean | null;
    hasSubtitleId: boolean | null;
    originalSource: string | null;
    archiveNotes: string | null;
  };
};

type QueryData = { episode: EpisodeDetail | null };

function formatDate(iso: string | null): string {
  if (!iso) return "不明";
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
  const slug = params.slug as string;

  const { data, loading, error } = useQuery<QueryData>(GET_EPISODE, {
    variables: { slug },
  });

  const ep = data?.episode;
  const d = ep?.episodeDetails;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-text-dim">読み込み中...</div>
      </div>
    );
  }

  if (error || !ep || !d) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">
            {error ? "エラー" : "エピソードが見つかりません"}
          </p>
          <Link href="/episodes" className="mt-4 inline-block text-sm underline text-primary">
            活動記録に戻る
          </Link>
        </div>
      </div>
    );
  }

  const videoId = d.youtubeVideoId;

  const infoRows: { label: string; value: string }[] = [
    { label: "配信日", value: formatDate(d.releaseDate) },
  ];
  if (d.episodeNumber) infoRows.push({ label: "話数", value: `第${d.episodeNumber}話` });
  if (d.durationSeconds) infoRows.push({ label: "再生時間", value: formatDuration(d.durationSeconds) });
  if (d.hasSubtitleJp) infoRows.push({ label: "JP字幕", value: "あり" });
  if (d.hasSubtitleId) infoRows.push({ label: "ID字幕", value: "あり" });

  const content = (
    <>
      {/* Video Player */}
      {videoId ? (
        <LinkuraPlayer
          videoId={videoId}
          title={ep.title}
          accentColor="#8b82f5"
        />
      ) : (
        <div
          className="w-full aspect-video rounded-xl flex flex-col items-center justify-center"
          style={{
            background: "linear-gradient(135deg, var(--linkura-surface-2), var(--linkura-border))",
          }}
        >
          <span className="text-4xl mb-2">📼</span>
          <p className="text-sm text-text-dim">動画未収録</p>
          {d.archiveNotes && (
            <p className="text-xs text-text-dim mt-1 opacity-60">{d.archiveNotes}</p>
          )}
        </div>
      )}

      {/* Title */}
      <div className="mt-4">
        <h1 className="text-xl font-bold leading-tight">{ep.title}</h1>
        <p className="text-xs text-text-dim mt-1">
          {formatDate(d.releaseDate)}
          {d.durationSeconds && ` · ${formatDuration(d.durationSeconds)}`}
        </p>
      </div>

      {/* Info table */}
      <div className="mt-4 rounded-xl overflow-hidden border border-border">
        {infoRows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center px-4 py-2.5 text-sm ${i > 0 ? "border-t border-border" : ""}`}
          >
            <span className="text-text-dim w-20 shrink-0">{row.label}</span>
            <span className="font-medium">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Summary */}
      {d.summaryJp && (
        <div className="mt-4">
          <h2 className="text-sm font-bold text-primary mb-2">あらすじ</h2>
          <p className="text-sm leading-relaxed text-foreground/80">{d.summaryJp}</p>
        </div>
      )}

      {/* Original source link */}
      {d.originalSource && (
        <a
          href={d.originalSource}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-xs underline text-text-dim hover:text-foreground"
        >
          オリジナルソース →
        </a>
      )}
    </>
  );

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={d.episodeNumber ?? 0} unitLabel="活動記録" />
        <main className="flex-1 px-3 pt-2 pb-20 overflow-y-auto">
          {content}
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
          <Link href="/episodes" className="text-xs text-text-dim hover:underline">
            ← 活動記録一覧
          </Link>
          <div className="mt-3">{content}</div>
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <main className="max-w-4xl mx-auto w-full px-8 py-8">
          <Link href="/episodes" className="text-sm text-text-dim hover:underline">
            ← 活動記録一覧
          </Link>
          <div className="mt-4">{content}</div>
        </main>
      </div>
    </>
  );
}
