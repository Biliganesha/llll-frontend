"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useLanguage, useTr } from "@/lib/language";
import { unitDisplayColors, formatDateLang } from "@/lib/unit-colors";

const GET_UNITS = gql`
  query GetUnits {
    units(first: 20) {
      nodes {
        databaseId
        title
        slug
        unitDetails {
          nameJp
          nameRomaji
          nameShort
          colorPrimary
          colorSecondary
          debutDate
          songsCount
          taglineJp
          taglineId
          logo {
            node {
              sourceUrl
            }
          }
          imageGroup {
            node {
              sourceUrl
            }
          }
          members {
            nodes {
              ... on Character {
                databaseId
                characterDetails {
                  nameJp
                  imageMain {
                    node {
                      sourceUrl
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

type MemberNode = {
  databaseId: number;
  characterDetails: {
    nameJp: string;
    imageMain: { node: { sourceUrl: string } } | null;
  };
};

type UnitNode = {
  databaseId: number;
  title: string;
  slug: string;
  unitDetails: {
    nameJp: string;
    nameRomaji: string;
    nameShort: string | null;
    colorPrimary: string | null;
    colorSecondary: string | null;
    debutDate: string | null;
    songsCount: number | null;
    taglineJp: string | null;
    taglineId: string | null;
    logo: { node: { sourceUrl: string } } | null;
    imageGroup: { node: { sourceUrl: string } } | null;
    members: { nodes: MemberNode[] } | null;
  };
};

type QueryData = { units: { nodes: UnitNode[] } };

function UnitCard({ unit }: { unit: UnitNode }) {
  const d = unit.unitDetails;
  const tr = useTr();
  const { lang } = useLanguage();
  const c = unitDisplayColors(d.colorPrimary, d.colorSecondary);
  const members = d.members?.nodes ?? [];
  const heroImage = d.imageGroup?.node.sourceUrl;
  const logoUrl = d.logo?.node.sourceUrl;

  return (
    <Link
      href={`/units/${unit.slug}`}
      className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
    >
      {/* Hero */}
      <div
        className="relative aspect-[2/1]"
        style={{ background: `linear-gradient(135deg, ${c.gradFrom} 0%, ${c.gradTo} 100%)` }}
      >
        {heroImage ? (
          <img src={heroImage} alt={d.nameJp} className="w-full h-full object-cover" />
        ) : logoUrl ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl px-7 py-4 shadow-sm">
              <img src={logoUrl} alt={d.nameJp} className="h-20 object-contain" />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white/15 tracking-wider select-none">{tr(d.nameJp, d.nameRomaji)}</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: `linear-gradient(to top, ${c.overlay}, transparent)` }}
        />

        {/* Unit name */}
        <div className="absolute bottom-3 left-3 right-3">
          <h2 className="text-xl font-extrabold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] group-hover:scale-[1.02] transition-transform origin-left">
            {tr(d.nameJp, d.nameRomaji)}
          </h2>
          <p className="text-xs text-white/85 drop-shadow">{tr(d.nameRomaji, d.nameJp)}</p>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-3 bg-white">
        {(d.taglineJp || d.taglineId) && (
          <p className="text-xs italic mb-2" style={{ color: c.accent }}>
            「{tr(d.taglineJp || "", d.taglineId || d.taglineJp || "")}」
          </p>
        )}

        {/* Member avatars */}
        {members.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex -space-x-2">
              {members.slice(0, 5).map((m) => (
                m.characterDetails.imageMain?.node.sourceUrl ? (
                  <img
                    key={m.databaseId}
                    src={m.characterDetails.imageMain.node.sourceUrl}
                    alt={m.characterDetails.nameJp}
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  />
                ) : (
                  <div
                    key={m.databaseId}
                    className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: c.accent }}
                  >
                    {m.characterDetails.nameJp[0]}
                  </div>
                )
              ))}
            </div>
            <span className="text-[11px] text-text-dim ml-1">
              {members.length}人
            </span>
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-2 text-[11px] text-text-dim">
          {d.debutDate && <span>{formatDateLang(d.debutDate, lang)}</span>}
          {d.songsCount && <span>{d.songsCount}曲</span>}
        </div>
      </div>
    </Link>
  );
}

export default function UnitsPage() {
  const { data, loading } = useQuery<QueryData>(GET_UNITS);
  const router = useRouter();
  const tr = useTr();
  const [menuOpen, setMenuOpen] = useState(false);

  const units = data?.units.nodes ?? [];

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
      <div className="sm:hidden flex-1 flex flex-col min-h-screen wallpaper-default relative">
        <StatusBar episodeCount={units.length} unitLabel={tr("ユニット", "Unit")} />
        <main className="flex-1 px-3 pt-3 pb-20 overflow-y-auto">
          <h1 className="text-xl font-bold brand-gradient-text mb-3">{tr("ユニット", "Unit")}</h1>
          <div className="space-y-4">
            {units.map((u) => (
              <UnitCard key={u.databaseId} unit={u} />
            ))}
          </div>
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
          <h1 className="text-2xl font-bold brand-gradient-text mb-4">{tr("ユニット", "Unit")}</h1>
          <div className="grid grid-cols-2 gap-4">
            {units.map((u) => (
              <UnitCard key={u.databaseId} unit={u} />
            ))}
          </div>
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <main className="max-w-5xl mx-auto w-full px-8 py-8">
          <h1 className="text-3xl font-bold brand-gradient-text mb-6">{tr("ユニット", "Unit")}</h1>
          <div className="grid grid-cols-2 gap-6">
            {units.map((u) => (
              <UnitCard key={u.databaseId} unit={u} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
