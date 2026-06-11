"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { CharacterCard } from "@/components/characters/CharacterCard";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language";
import { translate } from "@/lib/translations";
import { unitDisplayColors, formatDateLang } from "@/lib/unit-colors";
import { SourcesList, citeHtml } from "@/components/ui/SourcesList";

const GET_UNIT = gql`
  query GetUnit($slug: ID!) {
    unit(id: $slug, idType: SLUG) {
      databaseId
      title
      slug
      unitDetails {
        nameJp
        nameRomaji
        nameShort
        descriptionJp
        descriptionId
        taglineJp
        taglineId
        colorPrimary
        colorSecondary
        debutDate
        songsCount
        officialUrl
        sources
        logo {
          node {
            sourceUrl
            altText
          }
        }
        imageGroup {
          node {
            sourceUrl
            altText
          }
        }
        members {
          nodes {
            ... on Character {
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
  title: string;
  slug: string;
  characterDetails: {
    nameJp: string;
    nameRomaji: string;
    colorTheme: string | null;
    generation: string[] | null;
    seiyuu: string | null;
    imageMain: { node: { sourceUrl: string } } | null;
  };
};

type UnitDetail = {
  databaseId: number;
  title: string;
  slug: string;
  unitDetails: {
    nameJp: string;
    nameRomaji: string;
    nameShort: string | null;
    descriptionJp: string | null;
    descriptionId: string | null;
    taglineJp: string | null;
    taglineId: string | null;
    colorPrimary: string | null;
    colorSecondary: string | null;
    debutDate: string | null;
    songsCount: number | null;
    sources: string | null;
    officialUrl: string | null;
    logo: { node: { sourceUrl: string; altText: string } } | null;
    imageGroup: { node: { sourceUrl: string; altText: string } } | null;
    members: { nodes: MemberNode[] } | null;
  };
};

type QueryData = { unit: UnitDetail | null };

export default function UnitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, t } = useLanguage();
  const slug = params.slug as string;

  const { data, loading, error } = useQuery<QueryData>(GET_UNIT, {
    variables: { slug },
  });

  const u = data?.unit;
  const d = u?.unitDetails;
  const c = unitDisplayColors(d?.colorPrimary, d?.colorSecondary);
  const members = d?.members?.nodes ?? [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-text-dim">{translate("common.loading", lang)}</div>
      </div>
    );
  }

  if (error || !u || !d) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">
            {error ? translate("common.error", lang) : translate("common.notFound", lang)}
          </p>
          <Link href="/units" className="mt-4 inline-block text-sm underline text-primary">
            {`← ${translate("nav.units", lang)}`}
          </Link>
        </div>
      </div>
    );
  }

  const heroImage = d.imageGroup?.node.sourceUrl;
  const logoUrl = d.logo?.node.sourceUrl;
  const tagline = t(d.taglineJp, d.taglineId);
  const descHtml = t(d.descriptionJp, d.descriptionId);
  const backLabel = `← ${translate("nav.units", lang)}`;

  // Banner ramping ala header wiki — identitas warna + judul; logo & data pindah ke infobox.
  const heroSection = (
    <div
      className="relative w-full h-28 sm:h-32 lg:h-36 rounded-2xl overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${c.gradFrom} 0%, ${c.gradTo} 100%)` }}
    >
      {heroImage && <img src={heroImage} alt={d.nameJp} className="w-full h-full object-cover" />}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{ background: `linear-gradient(to top, ${c.overlay}, transparent)` }}
      />
      <div className="absolute bottom-3 left-4 right-4">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">{d.nameJp}</h1>
        <p className="text-xs lg:text-sm text-white/85 drop-shadow">{d.nameRomaji}</p>
      </div>
    </div>
  );

  const taglineSection = tagline && (
    <p className="text-center italic text-sm mt-4" style={{ color: c.accent }}>
      「{tagline}」
    </p>
  );

  // Infobox ala wikia (riset: Fandom Groups Infobox — gambar di atas, baris Nama/Romaji/Members/Debut)
  const infoRow = (label: string, value: string | null | undefined) =>
    value ? (
      <div className="flex items-start px-4 py-2.5 text-sm border-t border-border">
        <span className="text-text-dim w-24 shrink-0 pr-2">{label}</span>
        <span className="font-medium min-w-0">{value}</span>
      </div>
    ) : null;
  const infoSection = (
    <div className="mt-4 rounded-xl overflow-hidden border border-border">
      {logoUrl && (
        <div className="flex items-center justify-center bg-white py-5 px-4">
          <img src={logoUrl} alt={`${d.nameJp} logo`} className="h-16 object-contain" />
        </div>
      )}
      <div className="px-4 py-1.5 text-xs font-bold text-white" style={{ background: c.accent }}>
        {t("基本情報", "Profil Unit")}
      </div>
      {infoRow(t("名前", "Nama"), d.nameJp)}
      {infoRow(t("ローマ字", "Romaji"), d.nameRomaji)}
      {infoRow(translate("units.abbreviation", lang), d.nameShort)}
      {infoRow(translate("units.formed", lang), formatDateLang(d.debutDate, lang))}
      {infoRow(translate("units.members", lang), members.length ? `${members.length}人` : null)}
      <div className="flex items-start px-4 py-2.5 text-sm border-t border-border">
        <span className="text-text-dim w-24 shrink-0 pr-2">{t("カラー", "Warna")}</span>
        <span className="font-medium inline-flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full border border-border" style={{ background: c.color }} />
          {c.color}
        </span>
      </div>
    </div>
  );

  const descSection = descHtml ? (
    <div className="mt-4">
      <div
        className="text-sm leading-relaxed text-foreground/80"
        dangerouslySetInnerHTML={{ __html: citeHtml(descHtml) }}
      />
      <SourcesList raw={d.sources} accent={c.accent} />
    </div>
  ) : null;

  const membersSection = (cols: number) => (
    <div className="mt-6">
      <h2 className="text-base font-bold mb-3" style={{ color: c.accent }}>
        {translate("units.members", lang)} ({members.length})
      </h2>
      <div className={`grid grid-cols-${cols} gap-3`}>
        {members.map((m) => (
          <CharacterCard
            key={m.databaseId}
            slug={m.slug}
            nameJp={m.characterDetails.nameJp}
            nameRomaji={m.characterDetails.nameRomaji}
            colorTheme={m.characterDetails.colorTheme}
            generation={m.characterDetails.generation?.[0] ?? null}
            seiyuu={m.characterDetails.seiyuu}
            unitName={null}
            unitColor={null}
            imageUrl={m.characterDetails.imageMain?.node.sourceUrl ?? null}
            variant={cols <= 2 ? "compact" : "default"}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={members.length} unitLabel={d.nameJp} />
        <main className="flex-1 px-3 pt-2 pb-20 overflow-y-auto">
          {heroSection}
          {taglineSection}
          {infoSection}
          {descSection}
          {membersSection(2)}
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
          <Link href="/units" className="text-xs text-text-dim hover:underline">
            {backLabel}
          </Link>
          <div className="mt-3">
            {heroSection}
            {taglineSection}
            {infoSection}
            {descSection}
            {membersSection(3)}
          </div>
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <main className="max-w-5xl mx-auto w-full px-8 py-8">
          <Link href="/units" className="text-sm text-text-dim hover:underline">
            {backLabel}
          </Link>
          <div className="mt-4">
            {heroSection}
            {taglineSection}
            <div className="flex gap-8 mt-4">
              <div className="flex-1">
                {descSection}
              </div>
              <div className="w-64 shrink-0">
                {infoSection}
                {d.officialUrl && (
                  <a
                    href={d.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs underline text-text-dim"
                  >
                    Official Site →
                  </a>
                )}
              </div>
            </div>
            {membersSection(4)}
          </div>
        </main>
      </div>
    </>
  );
}
