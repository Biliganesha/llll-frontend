"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { CharacterCard } from "@/components/characters/CharacterCard";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language";
import { unitDisplayColors } from "@/lib/unit-colors";

const GET_CHARACTERS_PAGE = gql`
  query GetCharactersPage {
    characters(first: 50) {
      nodes {
        databaseId
        title
        slug
        characterDetails {
          nameJp
          nameRomaji
          colorTheme
          generation
          seiyuu
          imageMain {
            node {
              sourceUrl
              altText
            }
          }
          unit {
            nodes {
              ... on Unit {
                title
                slug
                unitDetails {
                  nameJp
                  nameRomaji
                  colorPrimary
                }
              }
            }
          }
        }
      }
    }
    units(first: 10) {
      nodes {
        databaseId
        title
        slug
        unitDetails {
          nameJp
          nameRomaji
          colorPrimary
        }
      }
    }
  }
`;

type CharacterNode = {
  databaseId: number;
  title: string;
  slug: string;
  characterDetails: {
    nameJp: string;
    nameRomaji: string;
    colorTheme: string | null;
    generation: string[] | null;
    seiyuu: string | null;
    imageMain: { node: { sourceUrl: string; altText: string } } | null;
    unit: {
      nodes: {
        title: string;
        slug: string;
        unitDetails: { nameJp: string; nameRomaji: string; colorPrimary: string | null };
      }[];
    } | null;
  };
};

type UnitNode = {
  databaseId: number;
  title: string;
  slug: string;
  unitDetails: { nameJp: string; nameRomaji: string; colorPrimary: string | null };
};

type PageData = {
  characters: { nodes: CharacterNode[] };
  units: { nodes: UnitNode[] };
};

export default function CharactersPage() {
  const { data, loading, error } = useQuery<PageData>(GET_CHARACTERS_PAGE);
  const [filterUnit, setFilterUnit] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { lang } = useLanguage();
  const tr = (jp: string, id: string) => (lang === "jp" ? jp : id);

  const characters = data?.characters?.nodes ?? [];
  const units = data?.units?.nodes ?? [];

  const filtered = filterUnit
    ? characters.filter((c) =>
        c.characterDetails.unit?.nodes.some((u) => u.slug === filterUnit)
      )
    : characters;

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen wallpaper-default relative">
        <StatusBar episodeCount={characters.length} unitLabel={tr("メンバー", "Anggota")} />

        <main className="flex-1 px-3 pt-3 pb-20">
          <h1 className="text-xl font-bold brand-gradient-text mb-1">
            {tr("メンバー", "Anggota")}
          </h1>
          <p className="text-xs text-text-dim mb-3">
            {tr("蓮ノ空女学院スクールアイドルクラブ", "Klub School Idol SMA Putri Hasunosora")}
          </p>

          {/* Unit filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
            <FilterChip
              label={tr("全員", "Semua")}
              active={!filterUnit}
              onClick={() => setFilterUnit(null)}
            />
            {units.map((u) => (
              <FilterChip
                key={u.slug}
                label={tr(u.unitDetails.nameJp, u.unitDetails.nameRomaji)}
                color={u.unitDetails.colorPrimary}
                active={filterUnit === u.slug}
                onClick={() => setFilterUnit(u.slug)}
              />
            ))}
          </div>

          {loading ? (
            <LoadingSkeleton count={6} cols={2} />
          ) : error ? (
            <ErrorMessage message={error.message} />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((c) => (
                <CharacterCard
                  key={c.databaseId}
                  slug={c.slug}
                  nameJp={c.characterDetails.nameJp}
                  nameRomaji={c.characterDetails.nameRomaji}
                  colorTheme={c.characterDetails.colorTheme}
                  generation={c.characterDetails.generation?.[0] ?? null}
                  seiyuu={c.characterDetails.seiyuu}
                  unitName={c.characterDetails.unit?.nodes[0]?.unitDetails.nameJp ?? null}
                  unitNameRomaji={c.characterDetails.unit?.nodes[0]?.unitDetails.nameRomaji ?? null}
                  unitColor={c.characterDetails.unit?.nodes[0]?.unitDetails.colorPrimary ?? null}
                  imageUrl={c.characterDetails.imageMain?.node.sourceUrl ?? null}
                  variant="compact"
                />
              ))}
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
        <header className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold brand-gradient-text">{tr("メンバー", "Anggota")}</h1>
          <p className="text-sm text-text-dim mt-1">
            {tr("蓮ノ空女学院スクールアイドルクラブ", "Klub School Idol SMA Putri Hasunosora")}
          </p>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            <FilterChip
              label={tr("全員", "Semua")}
              active={!filterUnit}
              onClick={() => setFilterUnit(null)}
            />
            {units.map((u) => (
              <FilterChip
                key={u.slug}
                label={tr(u.unitDetails.nameJp, u.unitDetails.nameRomaji)}
                color={u.unitDetails.colorPrimary}
                active={filterUnit === u.slug}
                onClick={() => setFilterUnit(u.slug)}
              />
            ))}
          </div>
        </header>

        <main className="flex-1 px-6 pb-6">
          {loading ? (
            <LoadingSkeleton count={6} cols={3} />
          ) : error ? (
            <ErrorMessage message={error.message} />
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filtered.map((c) => (
                <CharacterCard
                  key={c.databaseId}
                  slug={c.slug}
                  nameJp={c.characterDetails.nameJp}
                  nameRomaji={c.characterDetails.nameRomaji}
                  colorTheme={c.characterDetails.colorTheme}
                  generation={c.characterDetails.generation?.[0] ?? null}
                  seiyuu={c.characterDetails.seiyuu}
                  unitName={c.characterDetails.unit?.nodes[0]?.unitDetails.nameJp ?? null}
                  unitNameRomaji={c.characterDetails.unit?.nodes[0]?.unitDetails.nameRomaji ?? null}
                  unitColor={c.characterDetails.unit?.nodes[0]?.unitDetails.colorPrimary ?? null}
                  imageUrl={c.characterDetails.imageMain?.node.sourceUrl ?? null}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <header className="max-w-6xl mx-auto w-full px-8 pt-8 pb-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold brand-gradient-text">
                {tr("メンバー", "Anggota")}
              </h1>
              <p className="text-sm text-text-dim mt-1">
                {tr("蓮ノ空女学院スクールアイドルクラブ", "Klub School Idol SMA Putri Hasunosora")}{tr(` — ${characters.length}人`, ` — ${characters.length} anggota`)}
              </p>
            </div>

            <div className="flex gap-2">
              <FilterChip
                label={tr("全員", "Semua")}
                active={!filterUnit}
                onClick={() => setFilterUnit(null)}
              />
              {units.map((u) => (
                <FilterChip
                  key={u.slug}
                  label={tr(u.unitDetails.nameJp, u.unitDetails.nameRomaji)}
                  color={u.unitDetails.colorPrimary}
                  active={filterUnit === u.slug}
                  onClick={() => setFilterUnit(u.slug)}
                />
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto w-full px-8 pb-8 flex-1">
          {loading ? (
            <LoadingSkeleton count={12} cols={4} />
          ) : error ? (
            <ErrorMessage message={error.message} />
          ) : (
            <div className="grid grid-cols-4 gap-5">
              {filtered.map((c) => (
                <CharacterCard
                  key={c.databaseId}
                  slug={c.slug}
                  nameJp={c.characterDetails.nameJp}
                  nameRomaji={c.characterDetails.nameRomaji}
                  colorTheme={c.characterDetails.colorTheme}
                  generation={c.characterDetails.generation?.[0] ?? null}
                  seiyuu={c.characterDetails.seiyuu}
                  unitName={c.characterDetails.unit?.nodes[0]?.unitDetails.nameJp ?? null}
                  unitNameRomaji={c.characterDetails.unit?.nodes[0]?.unitDetails.nameRomaji ?? null}
                  unitColor={c.characterDetails.unit?.nodes[0]?.unitDetails.colorPrimary ?? null}
                  imageUrl={c.characterDetails.imageMain?.node.sourceUrl ?? null}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

/* ── Shared sub-components ── */

function FilterChip({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color?: string | null;
  active: boolean;
  onClick: () => void;
}) {
  // warna unit terang (Edel Note putih): pakai aksen gelap agar chip tetap terbaca
  const c = color ? unitDisplayColors(color) : null;
  return (
    <button
      onClick={onClick}
      className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer"
      style={
        active
          ? {
              background: color || "var(--linkura-primary)",
              color: c?.isLight ? "#475569" : "#fff",
              border: c?.isLight ? "1px solid #cbd5e1" : "1px solid transparent",
              boxShadow: `0 2px 8px ${(c?.isLight ? c.accent : color) || "var(--linkura-primary)"}40`,
            }
          : {
              background: "var(--linkura-surface)",
              color: (c?.isLight ? c.accent : color) || "var(--linkura-text-dim)",
              border: `1px solid var(--linkura-border)`,
            }
      }
    >
      {label}
    </button>
  );
}

function LoadingSkeleton({ count, cols }: { count: number; cols: number }) {
  return (
    <div className={`grid grid-cols-${cols} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden animate-pulse"
          style={{
            background: "var(--linkura-surface-2)",
            border: "1px solid var(--linkura-border)",
          }}
        >
          <div className="aspect-[3/4] bg-border/30" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-border/40 rounded w-2/3" />
            <div className="h-3 bg-border/30 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
      <p className="font-medium">データ取得エラー</p>
      <p className="mt-1 text-xs opacity-70">{message}</p>
    </div>
  );
}
