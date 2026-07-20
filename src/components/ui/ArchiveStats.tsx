"use client";

import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useLanguage } from "@/lib/language";

const GET_COUNTS = gql`
  query GetArchiveCounts {
    episodes(first: 500) {
      nodes {
        databaseId
      }
    }
    episodeParts(first: 500) {
      nodes {
        databaseId
      }
    }
    sukukoneVideos(first: 500) {
      nodes {
        databaseId
      }
    }
    characters(first: 50) {
      nodes {
        databaseId
      }
    }
    seiyuus(first: 50) {
      nodes {
        databaseId
      }
    }
    units(first: 20) {
      nodes {
        databaseId
      }
    }
  }
`;

type CountData = Record<string, { nodes: { databaseId: number }[] }>;

/**
 * ArchiveStats — panel "sebanyak ini yang berhasil diselamatkan".
 * Angka DIHITUNG LIVE (GraphQL + manifest koleksi), tak pernah di-hardcode,
 * supaya tak pernah basi saat isi arsip bertambah.
 * Catatan sengaja: yang ditampilkan angka PELESTARIAN, bukan trafik pengunjung.
 */
export function ArchiveStats() {
  const { t } = useLanguage();
  const { data } = useQuery<CountData>(GET_COUNTS);
  const [col, setCol] = useState<{ sticker: number; comic: number; music: number } | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all(
      (["sticker", "comic", "music"] as const).map((n) =>
        fetch(`/collection/manifest-${n}.json`)
          .then((r) => (r.ok ? r.json() : null))
          .then((j) => (j?.count as number) ?? 0)
          .catch(() => 0)
      )
    ).then(([sticker, comic, music]) => {
      if (alive) setCol({ sticker, comic, music });
    });
    return () => {
      alive = false;
    };
  }, []);

  const n = (k: string) => data?.[k]?.nodes.length ?? 0;

  const items: { value: number; jp: string; id: string }[] = [
    { value: n("sukukoneVideos"), jp: "スクコネ配信", id: "Siaran SukuKone" },
    { value: n("episodes"), jp: "活動記録エピソード", id: "Episode Cerita" },
    { value: n("episodeParts"), jp: "パート", id: "Bagian Cerita" },
    { value: col?.sticker ?? 0, jp: "ステッカー", id: "Stiker" },
    { value: col?.comic ?? 0, jp: "コミック", id: "Komik" },
    { value: col?.music ?? 0, jp: "楽曲ジャケット", id: "Sampul Lagu" },
    { value: n("characters"), jp: "メンバー", id: "Anggota" },
    { value: n("seiyuus"), jp: "声優", id: "Seiyuu" },
    { value: n("units"), jp: "ユニット", id: "Unit" },
  ].filter((x) => x.value > 0);

  if (items.length === 0) return null;

  const total = items.reduce((a, b) => a + b.value, 0);

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="brand-gradient-bg px-4 py-2">
        <h2 className="text-sm font-bold text-white drop-shadow">
          {t("保存できたもの", "Yang Berhasil Dilestarikan")}
        </h2>
      </div>
      <div className="p-4">
        <p className="text-xs text-text-dim mb-3 leading-relaxed">
          {t(
            "リンクラのサービス終了までに、この数だけの記録をここに残すことができました。数は増え続けます。",
            "Sebanyak inilah catatan yang berhasil kami simpan sampai layanan Linkura ditutup — dan jumlahnya masih terus bertambah."
          )}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {items.map((it) => (
            <div
              key={it.jp}
              className="rounded-lg bg-surface-2/60 px-2 py-2.5 text-center"
            >
              <div className="text-lg font-extrabold tabular-nums brand-gradient-text leading-none">
                {it.value.toLocaleString("ja-JP")}
              </div>
              <div className="mt-1 text-[10px] font-semibold text-text-dim leading-tight">
                {t(it.jp, it.id)}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-text-dim">
          {t(
            `合計 ${total.toLocaleString("ja-JP")} 件の記録`,
            `Total ${total.toLocaleString("id-ID")} catatan terlestarikan`
          )}
        </p>
      </div>
    </div>
  );
}
