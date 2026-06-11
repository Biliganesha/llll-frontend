"use client";

import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useLanguage } from "@/lib/language";

/**
 * NostalgiaWidget — "Hari ini di Hasunosora": arsip nyata (episode 活動記録,
 * スクコネ, ulang tahun member) yang jatuh di tanggal hari ini lintas tahun.
 */
const GET_NOSTALGIA = gql`
  query GetNostalgiaToday {
    episodes(first: 500) {
      nodes {
        databaseId
        title
        slug
        episodeDetails {
          releaseDate
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
          nameRomaji
          birthday
          colorTheme
        }
      }
    }
  }
`;

type QueryData = {
  episodes: {
    nodes: {
      databaseId: number;
      title: string;
      slug: string;
      episodeDetails: { releaseDate: string | null };
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
      characterDetails: {
        nameJp: string;
        nameRomaji: string | null;
        birthday: string | null;
        colorTheme: string | null;
      };
    }[];
  };
};

type Entry = {
  id: string;
  badge: string; // tahun ("2023") atau "🎂"
  title: string;
  subtitle: string;
  href: string;
  gradient: string;
  sortKey: number;
};

function mmddOf(d: Date) {
  return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function NostalgiaWidget() {
  const [mmdd, setMmdd] = useState<string>("");
  const { t, lang } = useLanguage();
  const { data, loading } = useQuery<QueryData>(GET_NOSTALGIA);

  useEffect(() => {
    setMmdd(mmddOf(new Date()));
  }, []);

  const entries: Entry[] = [];
  if (data && mmdd) {
    for (const ep of data.episodes.nodes) {
      const raw = ep.episodeDetails.releaseDate;
      if (!raw) continue;
      const d = new Date(raw);
      if (mmddOf(d) !== mmdd) continue;
      entries.push({
        id: `ep-${ep.databaseId}`,
        badge: String(d.getFullYear()),
        title: ep.title,
        subtitle: t("活動記録", "Catatan Aktivitas"),
        href: `/katsudou-kiroku/ep/${ep.slug}`,
        gradient: "linear-gradient(135deg,#6a7bff,#a88dff)",
        sortKey: d.getFullYear(),
      });
    }
    for (const sv of data.sukukoneVideos.nodes) {
      const raw = sv.sukukoneVideoDetails.airDate;
      if (!raw) continue;
      const d = new Date(raw);
      if (mmddOf(d) !== mmdd) continue;
      entries.push({
        id: `sv-${sv.databaseId}`,
        badge: String(d.getFullYear()),
        title: sv.title,
        subtitle: sv.sukukoneVideoDetails.tabType?.[0] ?? t("スクコネ", "SukuKone"),
        href: `/sukukone/${sv.slug}`,
        gradient: "linear-gradient(135deg,#ef5a8f,#c084fc)",
        sortKey: d.getFullYear(),
      });
    }
    for (const ch of data.characters.nodes) {
      const m = ch.characterDetails.birthday?.match(/(\d+)月(\d+)日/);
      if (!m) continue;
      const key = `${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
      if (key !== mmdd) continue;
      const name = lang === "jp" ? ch.characterDetails.nameJp : ch.characterDetails.nameRomaji || ch.characterDetails.nameJp;
      entries.push({
        id: `bd-${ch.databaseId}`,
        badge: "🎂",
        title: t(`${ch.characterDetails.nameJp}の誕生日`, `Ulang tahun ${name}`),
        subtitle: t("お誕生日おめでとう！", "Selamat ulang tahun!"),
        href: `/characters/${ch.slug}`,
        gradient: `linear-gradient(135deg,${ch.characterDetails.colorTheme || "#f59e0b"},#ef5a8f)`,
        sortKey: 9999,
      });
    }
    entries.sort((a, b) => a.sortKey - b.sortKey);
  }

  return (
    <section className="bg-white p-4">
      <header className="flex items-baseline justify-between mb-2">
        <h2 className="text-sm font-bold brand-gradient-text">
          {t("今日の蓮ノ空", "Hari Ini di Hasunosora")}
        </h2>
        <span className="text-[10px] text-[var(--linkura-text-dim)] tabular-nums">
          {mmdd}
        </span>
      </header>

      <p className="text-[11px] text-[var(--linkura-text-dim)] mb-3 leading-relaxed">
        {t(
          "この日に配信されたコンテンツを、過去の年から振り返ります。",
          "Konten yang tayang di tanggal ini, dari tahun-tahun sebelumnya."
        )}
      </p>

      {loading && (
        <p className="text-[11px] text-[var(--linkura-text-dim)] py-3 text-center">
          {t("読み込み中…", "Memuat…")}
        </p>
      )}

      {!loading && entries.length === 0 && (
        <p className="text-[11px] text-[var(--linkura-text-dim)] py-3 text-center leading-relaxed">
          {t(
            "この日のアーカイブはまだありません。アーカイブは少しずつ増えていきます。",
            "Belum ada arsip untuk tanggal ini. Arsip akan terus bertambah sedikit demi sedikit."
          )}
        </p>
      )}

      <ul className="space-y-1.5">
        {entries.map((e) => (
          <li key={e.id}>
            <Link
              href={e.href}
              className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--linkura-surface-2)]/60 hover:bg-[var(--linkura-surface-2)] transition-colors"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0 tabular-nums"
                style={{ background: e.gradient }}
              >
                {e.badge}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[var(--linkura-text)] truncate">
                  {e.title}
                </div>
                <div className="text-[10px] text-[var(--linkura-text-dim)] truncate">
                  {e.subtitle}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
