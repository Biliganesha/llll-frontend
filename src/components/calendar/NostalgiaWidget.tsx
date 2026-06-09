"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";

type NostalgiaEntry = {
  id: string;
  year: number;
  type: "with-meets" | "fes-live" | "with-station" | "katsudou-kiroku";
  character?: string;
  characterRomaji?: string;
  unit?: string;
  unitRomaji?: string;
  title: string;
};

const MOCK_ENTRIES: NostalgiaEntry[] = [
  {
    id: "mock-1",
    year: 2023,
    type: "with-meets",
    character: "日野下 花帆",
    characterRomaji: "Hinoshita Kaho",
    unit: "Cerise Bouquet",
    unitRomaji: "Cerise Bouquet",
    title: "初めてのWith×MEETS — ドキドキの配信!",
  },
  {
    id: "mock-2",
    year: 2024,
    type: "fes-live",
    character: "乙宗 梢",
    characterRomaji: "Otomune Kozue",
    unit: "Cerise Bouquet",
    unitRomaji: "Cerise Bouquet",
    title: "Fes×LIVE #12 — 桜舞う月",
  },
  {
    id: "mock-3",
    year: 2025,
    type: "with-meets",
    character: "藤島 慈",
    characterRomaji: "Fujishima Megumi",
    unit: "みらくらぱーく!",
    unitRomaji: "Mira-Cra Park!",
    title: "With×MEETS 新学期スペシャル",
  },
];

function todayMMDD() {
  const d = new Date();
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  return `${mm}-${dd}`;
}

export function NostalgiaWidget() {
  const [mmdd, setMmdd] = useState<string>("");
  const { t } = useLanguage();

  useEffect(() => {
    setMmdd(todayMMDD());
  }, []);

  const entries = MOCK_ENTRIES;

  return (
    <section className="bg-white p-4">
      <header className="flex items-baseline justify-between mb-2">
        <h2 className="text-sm font-bold brand-gradient-text">
          {t("今日の蓮ノ空", "Hari Ini di 蓮ノ空")}
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

      <ul className="space-y-1.5">
        {entries.map((e) => (
          <li
            key={e.id}
            className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--linkura-surface-2)]/60 hover:bg-[var(--linkura-surface-2)] transition-colors cursor-pointer"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0 tabular-nums"
              style={{
                background:
                  e.type === "fes-live"
                    ? "linear-gradient(135deg,#ef5a8f,#c084fc)"
                    : e.type === "with-meets"
                      ? "linear-gradient(135deg,#6a7bff,#a88dff)"
                      : "linear-gradient(135deg,#f59e0b,#ef5a8f)",
              }}
            >
              {e.year}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[var(--linkura-text)] truncate">
                {e.title}
              </div>
              <div className="text-[10px] text-[var(--linkura-text-dim)] truncate">
                {t(e.character ?? "", e.characterRomaji ?? "")} · {t(e.unit ?? "", e.unitRomaji ?? "")}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[10px] text-[var(--linkura-text-dim)] italic">
        {t(
          "※ サンプルデータです。バックエンド接続後に実データに切り替わります。",
          "* Data sampel. Akan terhubung ke arsip setelah backend siap."
        )}
      </p>
    </section>
  );
}
