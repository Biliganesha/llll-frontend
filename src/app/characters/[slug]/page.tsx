"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useState } from "react";
import Link from "next/link";

const GET_CHARACTER = gql`
  query GetCharacter($slug: ID!) {
    character(id: $slug, idType: SLUG) {
      databaseId
      title
      slug
      characterDetails {
        nameJp
        nameRomaji
        nameId
        bioJp
        bioId
        birthday
        hobby
        seiyuu
        schoolClass
        colorTheme
        generation
        officialWikiUrl
        imageMain {
          node {
            sourceUrl
            altText
          }
        }
        imageChibi {
          node {
            sourceUrl
            altText
          }
        }
        unit {
          nodes {
            ... on Unit {
              databaseId
              title
              slug
              unitDetails {
                nameJp
                nameRomaji
                colorPrimary
                logo {
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

type CharacterDetail = {
  databaseId: number;
  title: string;
  slug: string;
  characterDetails: {
    nameJp: string;
    nameRomaji: string;
    nameId: string | null;
    bioJp: string | null;
    bioId: string | null;
    birthday: string | null;
    hobby: string | null;
    seiyuu: string | null;
    schoolClass: string | null;
    colorTheme: string | null;
    generation: string[] | null;
    officialWikiUrl: string | null;
    imageMain: { node: { sourceUrl: string; altText: string } } | null;
    imageChibi: { node: { sourceUrl: string; altText: string } } | null;
    unit: {
      nodes: {
        databaseId: number;
        title: string;
        slug: string;
        unitDetails: {
          nameJp: string;
          nameRomaji: string;
          colorPrimary: string | null;
          logo: { node: { sourceUrl: string } } | null;
        };
      }[];
    } | null;
  };
};

type QueryData = {
  character: CharacterDetail | null;
};

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const slug = params.slug as string;

  const { data, loading, error } = useQuery<QueryData>(GET_CHARACTER, {
    variables: { slug },
  });

  const c = data?.character;
  const d = c?.characterDetails;
  const color = d?.colorTheme || "#8b82f5";
  const unit = d?.unit?.nodes[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-text-dim">読み込み中...</div>
      </div>
    );
  }

  if (error || !c || !d) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">
            {error ? "エラー" : "メンバーが見つかりません"}
          </p>
          <p className="text-sm text-text-dim mt-2">
            {error?.message || `slug: ${slug}`}
          </p>
          <Link
            href="/characters"
            className="mt-4 inline-block text-sm underline"
            style={{ color }}
          >
            メンバー一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const infoRows: { label: string; value: string }[] = [];
  if (d.birthday) infoRows.push({ label: "誕生日", value: d.birthday });
  if (d.generation?.[0])
    infoRows.push({ label: "学年", value: `${d.generation[0]}期生` });
  if (d.schoolClass) infoRows.push({ label: "クラス", value: d.schoolClass });
  if (d.hobby) infoRows.push({ label: "趣味", value: d.hobby });
  if (d.seiyuu) infoRows.push({ label: "CV", value: d.seiyuu });

  const heroImage = d.imageMain?.node.sourceUrl;

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={0} unitLabel={d.nameJp} />

        <main className="flex-1 pb-20 overflow-y-auto">
          {/* Hero */}
          <div
            className="relative aspect-[3/4] max-h-[55vh]"
            style={{
              background: `linear-gradient(180deg, ${color}30 0%, ${color}10 100%)`,
            }}
          >
            {heroImage ? (
              <img
                src={heroImage}
                alt={d.nameJp}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl opacity-20">🎀</span>
              </div>
            )}

            {/* Gradient overlay bottom */}
            <div
              className="absolute inset-x-0 bottom-0 h-24"
              style={{
                background: `linear-gradient(to top, var(--linkura-bg), transparent)`,
              }}
            />
          </div>

          {/* Profile info */}
          <div className="px-4 -mt-8 relative z-10">
            <h1 className="text-2xl font-bold" style={{ color }}>
              {d.nameJp}
            </h1>
            <p className="text-sm text-text-dim">{d.nameRomaji}</p>
            {d.nameId && (
              <p className="text-xs text-text-dim mt-0.5">{d.nameId}</p>
            )}

            {/* Unit link */}
            {unit && (
              <Link
                href={`/units/${unit.slug}`}
                className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                style={{
                  background: unit.unitDetails.colorPrimary || color,
                }}
              >
                {unit.unitDetails.nameJp}
              </Link>
            )}

            {/* Info table */}
            <div className="mt-4 rounded-xl overflow-hidden border border-border">
              {infoRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-center px-4 py-2.5 text-sm ${
                    i > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <span className="text-text-dim w-16 shrink-0">
                    {row.label}
                  </span>
                  <span className="font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Bio */}
            {d.bioJp && (
              <div className="mt-4">
                <h2
                  className="text-sm font-bold mb-2"
                  style={{ color }}
                >
                  プロフィール
                </h2>
                <div
                  className="text-sm leading-relaxed text-foreground/80 prose-sm"
                  dangerouslySetInnerHTML={{ __html: d.bioJp }}
                />
              </div>
            )}

            {d.bioId && (
              <div className="mt-3">
                <h2 className="text-sm font-bold mb-2 text-text-dim">
                  Profil (ID)
                </h2>
                <div
                  className="text-sm leading-relaxed text-text-dim prose-sm"
                  dangerouslySetInnerHTML={{ __html: d.bioId }}
                />
              </div>
            )}

            {/* Official link */}
            {d.officialWikiUrl && (
              <a
                href={d.officialWikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-xs underline text-text-dim"
              >
                Official Wiki
              </a>
            )}
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
      <div className="hidden sm:flex lg:hidden flex-1 min-h-screen bg-background">
        <div className="flex flex-1">
          {/* Left: image */}
          <div
            className="w-2/5 relative"
            style={{
              background: `linear-gradient(180deg, ${color}25 0%, ${color}10 100%)`,
            }}
          >
            {heroImage ? (
              <img
                src={heroImage}
                alt={d.nameJp}
                className="w-full h-full object-cover sticky top-0"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center sticky top-0">
                <span className="text-8xl opacity-20">🎀</span>
              </div>
            )}
          </div>

          {/* Right: info */}
          <div className="w-3/5 p-6 overflow-y-auto">
            <Link
              href="/characters"
              className="text-xs text-text-dim hover:underline"
            >
              ← メンバー一覧
            </Link>

            <h1 className="text-3xl font-bold mt-3" style={{ color }}>
              {d.nameJp}
            </h1>
            <p className="text-base text-text-dim">{d.nameRomaji}</p>

            {unit && (
              <Link
                href={`/units/${unit.slug}`}
                className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                style={{
                  background: unit.unitDetails.colorPrimary || color,
                }}
              >
                {unit.unitDetails.nameJp}
              </Link>
            )}

            <div className="mt-5 rounded-xl overflow-hidden border border-border">
              {infoRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-center px-4 py-3 text-sm ${
                    i > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <span className="text-text-dim w-20 shrink-0">
                    {row.label}
                  </span>
                  <span className="font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            {d.bioJp && (
              <div className="mt-5">
                <h2 className="text-base font-bold mb-2" style={{ color }}>
                  プロフィール
                </h2>
                <div
                  className="text-sm leading-relaxed text-foreground/80"
                  dangerouslySetInnerHTML={{ __html: d.bioJp }}
                />
              </div>
            )}

            {d.bioId && (
              <div className="mt-4">
                <h2 className="text-base font-bold mb-2 text-text-dim">
                  Profil (ID)
                </h2>
                <div
                  className="text-sm leading-relaxed text-text-dim"
                  dangerouslySetInnerHTML={{ __html: d.bioId }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <div className="max-w-5xl mx-auto w-full px-8 py-8">
          <Link
            href="/characters"
            className="text-sm text-text-dim hover:underline"
          >
            ← メンバー一覧
          </Link>

          <div className="flex gap-10 mt-6">
            {/* Left: image */}
            <div className="w-80 shrink-0">
              <div
                className="rounded-2xl overflow-hidden aspect-[3/4]"
                style={{
                  background: `linear-gradient(180deg, ${color}20 0%, ${color}40 100%)`,
                }}
              >
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt={d.nameJp}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl opacity-20">🎀</span>
                  </div>
                )}
              </div>

              {/* Chibi */}
              {d.imageChibi?.node.sourceUrl && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={d.imageChibi.node.sourceUrl}
                    alt={`${d.nameJp} chibi`}
                    className="h-24 object-contain"
                  />
                </div>
              )}
            </div>

            {/* Right: info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold" style={{ color }}>
                {d.nameJp}
              </h1>
              <p className="text-lg text-text-dim mt-1">{d.nameRomaji}</p>
              {d.nameId && (
                <p className="text-sm text-text-dim">{d.nameId}</p>
              )}

              {unit && (
                <Link
                  href={`/units/${unit.slug}`}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{
                    background: unit.unitDetails.colorPrimary || color,
                  }}
                >
                  {unit.unitDetails.nameJp}
                </Link>
              )}

              <div className="mt-6 rounded-xl overflow-hidden border border-border">
                {infoRows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center px-5 py-3 ${
                      i > 0 ? "border-t border-border" : ""
                    }`}
                  >
                    <span className="text-text-dim w-24 shrink-0 text-sm">
                      {row.label}
                    </span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              {d.bioJp && (
                <div className="mt-6">
                  <h2
                    className="text-lg font-bold mb-2"
                    style={{ color }}
                  >
                    プロフィール
                  </h2>
                  <div
                    className="leading-relaxed text-foreground/80"
                    dangerouslySetInnerHTML={{ __html: d.bioJp }}
                  />
                </div>
              )}

              {d.bioId && (
                <div className="mt-4">
                  <h2 className="text-lg font-bold mb-2 text-text-dim">
                    Profil (ID)
                  </h2>
                  <div
                    className="leading-relaxed text-text-dim"
                    dangerouslySetInnerHTML={{ __html: d.bioId }}
                  />
                </div>
              )}

              {d.officialWikiUrl && (
                <a
                  href={d.officialWikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm underline text-text-dim hover:text-foreground"
                >
                  Official Wiki →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
