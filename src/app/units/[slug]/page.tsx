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
  const slug = params.slug as string;

  const { data, loading, error } = useQuery<QueryData>(GET_UNIT, {
    variables: { slug },
  });

  const u = data?.unit;
  const d = u?.unitDetails;
  const color = d?.colorPrimary || "#8b82f5";
  const color2 = d?.colorSecondary || color;
  const members = d?.members?.nodes ?? [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-text-dim">読み込み中...</div>
      </div>
    );
  }

  if (error || !u || !d) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">
            {error ? "エラー" : "ユニットが見つかりません"}
          </p>
          <Link href="/characters" className="mt-4 inline-block text-sm underline text-primary">
            メンバー一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const infoRows: { label: string; value: string }[] = [];
  if (d.nameShort) infoRows.push({ label: "略称", value: d.nameShort });
  if (d.debutDate) infoRows.push({ label: "結成", value: d.debutDate });
  if (d.songsCount) infoRows.push({ label: "楽曲数", value: `${d.songsCount}曲` });

  const heroImage = d.imageGroup?.node.sourceUrl;
  const logoUrl = d.logo?.node.sourceUrl;

  const heroSection = (
    <div
      className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color2} 100%)`,
      }}
    >
      {heroImage ? (
        <img src={heroImage} alt={d.nameJp} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {logoUrl ? (
            <img src={logoUrl} alt={d.nameJp} className="h-20 object-contain opacity-80" />
          ) : (
            <span className="text-6xl font-bold text-white/30">{d.nameJp}</span>
          )}
        </div>
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: `linear-gradient(to top, ${color}cc, transparent)` }}
      />

      {/* Unit name overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <h1 className="text-2xl font-bold text-white drop-shadow-lg">
          {d.nameJp}
        </h1>
        <p className="text-sm text-white/80">{d.nameRomaji}</p>
      </div>
    </div>
  );

  const taglineSection = d.taglineJp && (
    <p
      className="text-center italic text-sm mt-4"
      style={{ color }}
    >
      「{d.taglineJp}」
    </p>
  );

  const infoSection = infoRows.length > 0 && (
    <div className="mt-4 rounded-xl overflow-hidden border border-border">
      {infoRows.map((row, i) => (
        <div
          key={row.label}
          className={`flex items-center px-4 py-2.5 text-sm ${i > 0 ? "border-t border-border" : ""}`}
        >
          <span className="text-text-dim w-16 shrink-0">{row.label}</span>
          <span className="font-medium">{row.value}</span>
        </div>
      ))}
    </div>
  );

  const descSection = (
    <>
      {d.descriptionJp && (
        <div className="mt-4">
          <div
            className="text-sm leading-relaxed text-foreground/80"
            dangerouslySetInnerHTML={{ __html: d.descriptionJp }}
          />
        </div>
      )}
      {d.descriptionId && (
        <div className="mt-3">
          <p className="text-xs font-bold text-text-dim mb-1">Deskripsi (ID)</p>
          <div
            className="text-sm leading-relaxed text-text-dim"
            dangerouslySetInnerHTML={{ __html: d.descriptionId }}
          />
        </div>
      )}
    </>
  );

  const membersSection = (cols: number) => (
    <div className="mt-6">
      <h2 className="text-base font-bold mb-3" style={{ color }}>
        メンバー ({members.length})
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
          <Link href="/characters" className="text-xs text-text-dim hover:underline">
            ← メンバー一覧
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
          <Link href="/characters" className="text-sm text-text-dim hover:underline">
            ← メンバー一覧
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
