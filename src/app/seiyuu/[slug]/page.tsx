"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/language";
import { translate } from "@/lib/translations";

const GET_SEIYUU = gql`
  query GetSeiyuu($slug: ID!) {
    seiyuu(id: $slug, idType: SLUG) {
      title
      slug
      seiyuuProfile {
        nameJp
        nameRomaji
        nickname
        agency
        birthDate
        origin
        height
        occupation
        twitterUrl
        source
        bioJp
        bioId
        photo {
          node {
            sourceUrl
            altText
          }
        }
        character {
          nodes {
            ... on Character {
              slug
              characterDetails {
                nameJp
                nameRomaji
                colorTheme
              }
            }
          }
        }
      }
    }
  }
`;

type SeiyuuDetail = {
  title: string;
  slug: string;
  seiyuuProfile: {
    nameJp: string;
    nameRomaji: string;
    nickname: string | null;
    agency: string | null;
    birthDate: string | null;
    origin: string | null;
    height: string | null;
    occupation: string | null;
    twitterUrl: string | null;
    source: string | null;
    bioJp: string | null;
    bioId: string | null;
    photo: { node: { sourceUrl: string; altText: string | null } } | null;
    character: {
      nodes: {
        slug: string;
        characterDetails: { nameJp: string; nameRomaji: string; colorTheme: string | null };
      }[];
    } | null;
  };
};

type QueryData = { seiyuu: SeiyuuDetail | null };

export default function SeiyuuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, t } = useLanguage();
  const slug = params.slug as string;

  const { data, loading, error } = useQuery<QueryData>(GET_SEIYUU, { variables: { slug } });

  const s = data?.seiyuu;
  const p = s?.seiyuuProfile;
  const color = p?.character?.nodes?.[0]?.characterDetails.colorTheme || "#8b82f5";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-text-dim">{translate("common.loading", lang)}</div>
      </div>
    );
  }
  if (error || !s || !p) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">{translate("common.notFound", lang)}</p>
          <Link href="/seiyuu" className="mt-4 inline-block text-sm underline" style={{ color }}>
            {`← ${translate("nav.seiyuu", lang)}`}
          </Link>
        </div>
      </div>
    );
  }

  const photo = p.photo?.node.sourceUrl ?? null;
  const primaryName = lang === "jp" ? p.nameJp : p.nameRomaji || p.nameJp;
  const secondaryName = lang === "jp" ? p.nameRomaji : p.nameJp;
  const bioHtml = t(p.bioJp, p.bioId);
  const ch = p.character?.nodes?.[0] ?? null;

  type Row = { label: string; value: string };
  const row = (label: string, value: string | null | undefined): Row | null => (value ? { label, value } : null);
  const compact = (rs: (Row | null)[]) => rs.filter((r): r is Row => !!r);
  const sections: { title: string; rows: Row[] }[] = [
    {
      title: translate("characters.secBasic", lang),
      rows: compact([
        row(translate("seiyuu.nickname", lang), p.nickname),
        row(translate("seiyuu.agency", lang), p.agency),
      ]),
    },
    {
      title: translate("characters.secStats", lang),
      rows: compact([
        row(translate("characters.birthday", lang), p.birthDate),
        row(translate("seiyuu.origin", lang), p.origin),
        row(translate("characters.height", lang), p.height),
        row(translate("seiyuu.occupation", lang), p.occupation),
      ]),
    },
  ].filter((s) => s.rows.length > 0);

  const charName = ch ? (lang === "jp" ? ch.characterDetails.nameJp : ch.characterDetails.nameRomaji) : null;

  const infoCard = (
    <div className="rounded-xl overflow-hidden border border-border">
      {sections.map((sec) => (
        <div key={sec.title}>
          <div className="px-4 py-1.5 text-xs font-bold text-white" style={{ background: color }}>{sec.title}</div>
          {sec.rows.map((r) => (
            <div key={sec.title + r.label} className="flex items-start px-4 py-2.5 text-sm border-t border-border">
              <span className="text-text-dim w-28 shrink-0">{r.label}</span>
              <span className="font-medium">{r.value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const roleBlock = ch && charName ? (
    <Link
      href={`/characters/${ch.slug}`}
      className="mt-4 flex items-center gap-2 rounded-xl border border-border p-3 hover:bg-surface/40 transition"
    >
      <span className="text-xs text-text-dim">{translate("seiyuu.voices", lang)}</span>
      <span className="font-medium" style={{ color }}>{charName} →</span>
    </Link>
  ) : null;

  const links = p.twitterUrl ? (
    <a href={p.twitterUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm underline" style={{ color }}>
      X / Twitter →
    </a>
  ) : null;

  const bioBlock = bioHtml ? (
    <div className="mt-4">
      <h2 className="text-sm font-bold mb-2" style={{ color }}>{translate("characters.bio", lang)}</h2>
      <div className="text-sm leading-relaxed text-foreground/80" dangerouslySetInnerHTML={{ __html: bioHtml }} />
    </div>
  ) : null;

  const sourceNote = p.source ? (
    <p className="mt-4 text-[10px] text-text-dim opacity-60">{translate("seiyuu.sourceNote", lang)}: {p.source}</p>
  ) : null;

  const photoBox = (size: string) => (
    <div className={`relative ${size} rounded-2xl overflow-hidden border border-border bg-surface shrink-0`}>
      {photo ? (
        <Image src={photo} alt={p.nameJp} fill sizes="320px" className="object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center"><span className="text-6xl opacity-30">🎤</span></div>
      )}
    </div>
  );

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={0} unitLabel={primaryName} />
        <main className="flex-1 px-4 pt-4 pb-20 overflow-y-auto">
          <div className="aspect-square w-2/3 mx-auto">{photoBox("w-full h-full")}</div>
          <h1 className="text-2xl font-bold mt-4" style={{ color }}>{primaryName}</h1>
          <p className="text-sm text-text-dim">{secondaryName}</p>
          <div className="mt-4">{infoCard}</div>
          {roleBlock}
          {links}
          {bioBlock}
          {sourceNote}
        </main>
        <BottomNav onBack={() => router.back()} onMenu={() => setMenuOpen(!menuOpen)} onHome={() => router.push("/")} menuOpen={menuOpen} />
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      {/* ===== TABLET / DESKTOP ===== */}
      <div className="hidden sm:flex flex-1 flex-col min-h-screen bg-background">
        <div className="max-w-4xl mx-auto w-full px-8 py-8">
          <Link href="/seiyuu" className="text-sm text-text-dim hover:underline">
            {`← ${translate("nav.seiyuu", lang)}`}
          </Link>
          <div className="flex gap-8 mt-6">
            <div className="w-64 shrink-0">{photoBox("w-64 h-64")}</div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl lg:text-4xl font-bold" style={{ color }}>{primaryName}</h1>
              <p className="text-lg text-text-dim mt-1">{secondaryName}</p>
              <div className="mt-5">{infoCard}</div>
              {roleBlock}
              {links}
              {bioBlock}
              {sourceNote}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
