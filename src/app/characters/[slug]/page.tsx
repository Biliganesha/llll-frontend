"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language";
import { translate } from "@/lib/translations";
import Image from "next/image";

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
  const { lang, t } = useLanguage();
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
        <div className="animate-pulse text-text-dim">{translate("common.loading", lang)}</div>
      </div>
    );
  }

  if (error || !c || !d) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">
            {error ? translate("common.error", lang) : translate("common.notFound", lang)}
          </p>
          <Link
            href="/characters"
            className="mt-4 inline-block text-sm underline"
            style={{ color }}
          >
            {`← ${translate("nav.members", lang)}`}
          </Link>
        </div>
      </div>
    );
  }

  const infoRows: { label: string; value: string }[] = [];
  if (d.birthday) infoRows.push({ label: translate("characters.birthday", lang), value: d.birthday });
  if (d.generation?.[0])
    infoRows.push({ label: translate("characters.generation", lang), value: `${d.generation[0]}期生` });
  if (d.schoolClass) infoRows.push({ label: translate("characters.class", lang), value: d.schoolClass });
  if (d.hobby) infoRows.push({ label: translate("characters.hobby", lang), value: d.hobby });
  if (d.seiyuu) infoRows.push({ label: translate("characters.cv", lang), value: d.seiyuu });

  const heroImage = d.imageMain?.node.sourceUrl;
  const bioHtml = t(d.bioJp, d.bioId);
  const bioLabel = translate("characters.bio", lang);
  const backLabel = `← ${translate("nav.members", lang)}`;

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
              <Image src={heroImage} alt={d.nameJp} fill sizes="100vw" className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl opacity-20">🎀</span>
              </div>
            )}
            <div
              className="absolute inset-x-0 bottom-0 h-24"
              style={{ background: `linear-gradient(to top, var(--linkura-bg), transparent)` }}
            />
          </div>

          {/* Profile info */}
          <div className="px-4 -mt-8 relative z-10">
            <h1 className="text-2xl font-bold" style={{ color }}>{d.nameJp}</h1>
            <p className="text-sm text-text-dim">{d.nameRomaji}</p>

            {unit && (
              <Link
                href={`/units/${unit.slug}`}
                className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                style={{ background: unit.unitDetails.colorPrimary || color }}
              >
                {unit.unitDetails.nameJp}
              </Link>
            )}

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

            {bioHtml && (
              <div className="mt-4">
                <h2 className="text-sm font-bold mb-2" style={{ color }}>{bioLabel}</h2>
                <div
                  className="text-sm leading-relaxed text-foreground/80 prose-sm"
                  dangerouslySetInnerHTML={{ __html: bioHtml }}
                />
              </div>
            )}

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
          <div
            className="w-2/5 relative"
            style={{ background: `linear-gradient(180deg, ${color}25 0%, ${color}10 100%)` }}
          >
            {heroImage ? (
              <Image src={heroImage} alt={d.nameJp} fill sizes="40vw" className="object-cover sticky top-0" />
            ) : (
              <div className="w-full h-full flex items-center justify-center sticky top-0">
                <span className="text-8xl opacity-20">🎀</span>
              </div>
            )}
          </div>

          <div className="w-3/5 p-6 overflow-y-auto">
            <Link href="/characters" className="text-xs text-text-dim hover:underline">
              {backLabel}
            </Link>

            <h1 className="text-3xl font-bold mt-3" style={{ color }}>{d.nameJp}</h1>
            <p className="text-base text-text-dim">{d.nameRomaji}</p>

            {unit && (
              <Link
                href={`/units/${unit.slug}`}
                className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                style={{ background: unit.unitDetails.colorPrimary || color }}
              >
                {unit.unitDetails.nameJp}
              </Link>
            )}

            <div className="mt-5 rounded-xl overflow-hidden border border-border">
              {infoRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-center px-4 py-3 text-sm ${i > 0 ? "border-t border-border" : ""}`}
                >
                  <span className="text-text-dim w-20 shrink-0">{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            {bioHtml && (
              <div className="mt-5">
                <h2 className="text-base font-bold mb-2" style={{ color }}>{bioLabel}</h2>
                <div
                  className="text-sm leading-relaxed text-foreground/80"
                  dangerouslySetInnerHTML={{ __html: bioHtml }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <div className="max-w-5xl mx-auto w-full px-8 py-8">
          <Link href="/characters" className="text-sm text-text-dim hover:underline">
            {backLabel}
          </Link>

          <div className="flex gap-10 mt-6">
            <div className="w-80 shrink-0">
              <div
                className="rounded-2xl overflow-hidden aspect-[3/4]"
                style={{ background: `linear-gradient(180deg, ${color}20 0%, ${color}40 100%)` }}
              >
                {heroImage ? (
                  <Image src={heroImage} alt={d.nameJp} fill sizes="320px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl opacity-20">🎀</span>
                  </div>
                )}
              </div>

              {d.imageChibi?.node.sourceUrl && (
                <div className="mt-4 flex justify-center">
                  <Image
                    src={d.imageChibi.node.sourceUrl}
                    alt={`${d.nameJp} chibi`}
                    width={96}
                    height={96}
                    className="h-24 w-auto object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold" style={{ color }}>{d.nameJp}</h1>
              <p className="text-lg text-text-dim mt-1">{d.nameRomaji}</p>

              {unit && (
                <Link
                  href={`/units/${unit.slug}`}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ background: unit.unitDetails.colorPrimary || color }}
                >
                  {unit.unitDetails.nameJp}
                </Link>
              )}

              <div className="mt-6 rounded-xl overflow-hidden border border-border">
                {infoRows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center px-5 py-3 ${i > 0 ? "border-t border-border" : ""}`}
                  >
                    <span className="text-text-dim w-24 shrink-0 text-sm">{row.label}</span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              {bioHtml && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold mb-2" style={{ color }}>{bioLabel}</h2>
                  <div
                    className="leading-relaxed text-foreground/80"
                    dangerouslySetInnerHTML={{ __html: bioHtml }}
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
