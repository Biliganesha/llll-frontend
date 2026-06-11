"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { SourcesList, withCitations } from "@/components/ui/SourcesList";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language";
import { translate, type TranslationKey } from "@/lib/translations";
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
        hobby
        seiyuu
        schoolClass
        colorTheme
        generation
        officialWikiUrl
        imageMain { node { sourceUrl altText } }
        imageChibi { node { sourceUrl altText } }
        unit {
          nodes {
            ... on Unit {
              databaseId
              title
              slug
              unitDetails { nameJp nameRomaji colorPrimary }
            }
          }
        }
      }
      characterBiodata {
        nameKana
        cvRomaji
        height
        birthdayMd
        imageColorName
        status
        hometownJp
        hometownId
        familyJp
        familyId
        skill
        favFood
        motto
        favSubject
        favAnimal
        hobbyId
        skillId
        favFoodId
        mottoId
        favSubjectId
        favAnimalId
        colorNameId
        seiyuuSource
        seiyuuImage { node { sourceUrl altText } }
        signature { node { sourceUrl altText } }
        appearanceJp
        appearanceId
        backgroundJp
        backgroundId
        relationshipsJp
        relationshipsId
        triviaJp
        triviaId
        introVideoUrl
        richSources
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
        unitDetails: { nameJp: string; nameRomaji: string; colorPrimary: string | null };
      }[];
    } | null;
  };
  characterBiodata: {
    nameKana: string | null;
    cvRomaji: string | null;
    height: string | null;
    birthdayMd: string | null;
    imageColorName: string | null;
    status: string[] | null;
    hometownJp: string | null;
    hometownId: string | null;
    familyJp: string | null;
    familyId: string | null;
    skill: string | null;
    favFood: string | null;
    motto: string | null;
    favSubject: string | null;
    favAnimal: string | null;
    hobbyId: string | null;
    skillId: string | null;
    favFoodId: string | null;
    mottoId: string | null;
    favSubjectId: string | null;
    favAnimalId: string | null;
    colorNameId: string | null;
    seiyuuSource: string | null;
    seiyuuImage: { node: { sourceUrl: string; altText: string | null } } | null;
    signature: { node: { sourceUrl: string; altText: string | null } } | null;
    appearanceJp: string | null;
    appearanceId: string | null;
    backgroundJp: string | null;
    backgroundId: string | null;
    relationshipsJp: string | null;
    relationshipsId: string | null;
    triviaJp: string | null;
    triviaId: string | null;
    introVideoUrl: string | null;
    richSources: string | null;
  } | null;
};

type QueryData = { character: CharacterDetail | null };

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const ZODIAC_JP = ["山羊座", "水瓶座", "魚座", "牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座"];
const ZODIAC_ID = ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"];
const ZODIAC_CUT = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, t } = useLanguage();
  const slug = params.slug as string;

  const { data, loading, error } = useQuery<QueryData>(GET_CHARACTER, { variables: { slug } });

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
          <Link href="/characters" className="mt-4 inline-block text-sm underline" style={{ color }}>
            {`← ${translate("nav.members", lang)}`}
          </Link>
        </div>
      </div>
    );
  }

  const bd = c.characterBiodata;
  const statusVal = bd?.status?.[0] || null;

  // Birthday + zodiak
  let birthdayStr: string | null = null;
  if (bd?.birthdayMd) {
    const [bm, bday] = bd.birthdayMd.split("-").map((n) => parseInt(n, 10));
    if (bm && bday) {
      const zi = bday < ZODIAC_CUT[bm - 1] ? bm - 1 : bm % 12;
      const sign = lang === "id" ? ZODIAC_ID[zi] : ZODIAC_JP[zi];
      const dateStr = lang === "id" ? `${bday} ${MONTHS_ID[bm - 1]}` : `${bm}月${bday}日`;
      birthdayStr = lang === "id" ? `${dateStr} (${sign})` : `${dateStr}（${sign}）`;
    }
  }

  const reading = lang === "jp" ? bd?.nameKana : d.nameRomaji;
  // Debut = saat angkatan mulai aktif di Linkura (102/103期 = rilis app 2023-04-15; 104期 = 2024-04; 105期 = 2025-04)
  const gen = d.generation?.[0];
  const debut =
    gen === "104" ? (lang === "id" ? "April 2024" : "2024年4月")
    : gen === "105" ? (lang === "id" ? "April 2025" : "2025年4月")
    : (lang === "id" ? "15 April 2023" : "2023年4月15日");
  const hometown = t(bd?.hometownJp ?? null, bd?.hometownId ?? null);
  const family = t(bd?.familyJp ?? null, bd?.familyId ?? null);

  type Row = { label: string; value: string };
  const row = (label: string, value: string | null | undefined): Row | null => (value ? { label, value } : null);
  const compact = (rows: (Row | null)[]) => rows.filter((r): r is Row => !!r);

  const sections: { title: string; rows: Row[] }[] = [
    {
      title: translate("characters.secBasic", lang),
      rows: compact([
        row(translate("characters.nameRow", lang), d.nameJp),
        row(translate("characters.romajiRow", lang), reading),
        row(translate("characters.affiliation", lang), translate("characters.clubName", lang)),
        row(translate("characters.debut", lang), debut),
        d.generation?.[0]
          ? { label: translate("characters.generation", lang), value: lang === "jp" ? `${d.generation[0]}期生` : `Angkatan ${d.generation[0]}` }
          : null,
        d.schoolClass
          ? {
              label: translate("characters.class", lang),
              value: lang === "id"
                ? ({ "高校一年生": "Kelas 1 SMA", "高校二年生": "Kelas 2 SMA", "高校三年生": "Kelas 3 SMA", "卒業生": "Lulusan" } as Record<string, string>)[d.schoolClass] || d.schoolClass
                : d.schoolClass,
            }
          : null,
        statusVal
          ? { label: translate("characters.status", lang), value: translate(statusVal === "graduated" ? "characters.statusGraduated" : "characters.statusEnrolled", lang) }
          : null,
      ]),
    },
    {
      title: translate("characters.secStats", lang),
      rows: compact([
        row(translate("characters.birthday", lang), birthdayStr),
        { label: translate("characters.gender", lang), value: translate("characters.genderFemale", lang) },
        row(translate("characters.height", lang), bd?.height),
        row(translate("characters.hometown", lang), hometown),
        row(translate("characters.colorName", lang), t(bd?.imageColorName ?? null, bd?.colorNameId ?? null)),
      ]),
    },
    {
      title: translate("characters.secFavorites", lang),
      rows: compact([
        row(translate("characters.hobby", lang), t(d.hobby, bd?.hobbyId ?? null)),
        row(translate("characters.skill", lang), t(bd?.skill ?? null, bd?.skillId ?? null)),
        row(translate("characters.favFood", lang), t(bd?.favFood ?? null, bd?.favFoodId ?? null)),
        row(translate("characters.favSubject", lang), t(bd?.favSubject ?? null, bd?.favSubjectId ?? null)),
        row(translate("characters.favAnimal", lang), t(bd?.favAnimal ?? null, bd?.favAnimalId ?? null)),
        row(translate("characters.motto", lang), t(bd?.motto ?? null, bd?.mottoId ?? null)),
      ]),
    },
    {
      title: translate("characters.secFamily", lang),
      rows: compact([row(translate("characters.secFamily", lang), family)]),
    },
  ].filter((s) => s.rows.length > 0);

  const heroImage = d.imageMain?.node.sourceUrl;
  const bioHtml = t(d.bioJp, d.bioId);
  const primaryName = lang === "jp" ? d.nameJp : d.nameRomaji || d.nameJp;
  const secondaryName = lang === "jp" ? d.nameRomaji : d.nameJp;
  const unitDisplay = unit ? (lang === "jp" ? unit.unitDetails.nameJp : unit.unitDetails.nameRomaji || unit.unitDetails.nameJp) : null;

  const seiyuuImg = bd?.seiyuuImage?.node?.sourceUrl || null;
  const seiyuuSlug = bd?.cvRomaji ? slugify(bd.cvRomaji) : null;
  const signatureImg = bd?.signature?.node?.sourceUrl || null;

  // ── Shared blocks (dipakai 3 layout) ──
  const biodataCard = (
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

  const cvInner = (
    <>
      {seiyuuImg && (
        <Image src={seiyuuImg} alt={d.seiyuu || ""} width={56} height={56} className="w-14 h-14 rounded-full object-cover shrink-0" />
      )}
      <div className="min-w-0">
        <div className="text-xs text-text-dim">{translate("characters.cv", lang)}</div>
        <div className="font-medium truncate">{bd?.cvRomaji ? `${d.seiyuu} / ${bd.cvRomaji}` : d.seiyuu}</div>
        {seiyuuSlug && <div className="text-[11px] mt-0.5" style={{ color }}>{translate("common.viewProfile", lang)}</div>}
      </div>
    </>
  );
  const seiyuuBlock = d.seiyuu ? (
    seiyuuSlug ? (
      <Link href={`/seiyuu/${seiyuuSlug}`} className="mt-4 flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-surface/40 transition">
        {cvInner}
      </Link>
    ) : (
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border p-3">{cvInner}</div>
    )
  ) : null;

  // Icon (chibi) + Signature + video perkenalan: satu blok berjudul, video di bawah signature.
  const iconImg = d.imageChibi?.node.sourceUrl || null;
  const introVideoId = bd?.introVideoUrl
    ? bd.introVideoUrl.match(/[?&]v=([\w-]+)/)?.[1] || bd.introVideoUrl.match(/youtu\.be\/([\w-]+)/)?.[1] || null
    : null;
  const iconSigBlock = iconImg || signatureImg || introVideoId ? (
    <div className="mt-4 lg:mt-6">
      {(iconImg || signatureImg) && (
        <>
          <h2 className="text-base lg:text-xl font-bold mb-2 lg:mb-3" style={{ color }}>{translate("characters.iconSignature", lang)}</h2>
          <div className="flex flex-col items-center gap-2 lg:gap-5">
            {iconImg && (
              <Image src={iconImg} alt={`${d.nameJp} icon`} width={176} height={176} className="h-20 lg:h-44 w-auto object-contain" />
            )}
            {signatureImg && (
              <Image src={signatureImg} alt={`${d.nameJp} signature`} width={320} height={116} className="h-16 lg:h-auto w-auto lg:w-full lg:max-h-36 object-contain opacity-90" />
            )}
          </div>
        </>
      )}
      {introVideoId && (
        <div className="mt-4">
          <h2 className="text-base lg:text-xl font-bold mb-2 lg:mb-3" style={{ color }}>{translate("characters.introVideo", lang)}</h2>
          <div className="relative w-full rounded-xl overflow-hidden border border-border" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              src={`https://www.youtube.com/embed/${introVideoId}`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              title={`${d.nameJp} intro`}
            />
          </div>
        </div>
      )}
    </div>
  ) : null;

  // Bagian naratif: bio + section "kaya" (appearance/background/relations/trivia, parafrase)
  const prose = (titleKey: TranslationKey, jp: string | null | undefined, id: string | null | undefined) => {
    const v = t(jp ?? null, id ?? null);
    return v ? (
      <div className="mt-4">
        <h2 className="text-base lg:text-xl font-bold mb-2 lg:mb-3" style={{ color }}>{translate(titleKey, lang)}</h2>
        <div className="text-base lg:text-lg leading-relaxed text-foreground/80 whitespace-pre-line">{withCitations(v)}</div>
      </div>
    ) : null;
  };
  const bioBlock = (
    <>
      {bioHtml && (
        <div className="mt-4">
          <h2 className="text-base lg:text-xl font-bold mb-2 lg:mb-3" style={{ color }}>{translate("characters.bio", lang)}</h2>
          <div className="text-base lg:text-lg leading-relaxed text-foreground/80" dangerouslySetInnerHTML={{ __html: bioHtml }} />
        </div>
      )}
      {prose("characters.appearance", bd?.appearanceJp, bd?.appearanceId)}
      {prose("characters.background", bd?.backgroundJp, bd?.backgroundId)}
      {prose("characters.relations", bd?.relationshipsJp, bd?.relationshipsId)}
      {prose("characters.trivia", bd?.triviaJp, bd?.triviaId)}
      <SourcesList raw={bd?.richSources} accent={color} />
    </>
  );

  const chip = "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition hover:opacity-80";
  const linksBlock = (
    <div className="mt-4 rounded-xl overflow-hidden border border-border">
      <div className="px-4 py-1.5 text-xs font-bold text-white" style={{ background: color }}>{translate("characters.secLinks", lang)}</div>
      <div className="p-3 flex flex-wrap gap-2">
        {unit && (
          <Link href={`/units/${unit.slug}`} className={chip} style={{ borderColor: `${color}55`, color }}>💫 {unitDisplay}</Link>
        )}
        {seiyuuSlug && (
          <Link href={`/seiyuu/${seiyuuSlug}`} className={chip} style={{ borderColor: `${color}55`, color }}>🎤 {translate("nav.seiyuu", lang)}</Link>
        )}
        <Link href="/relationships" className={chip} style={{ borderColor: `${color}55`, color }}>🔗 {translate("relationships.title", lang)}</Link>
        {d.officialWikiUrl && (
          <a href={d.officialWikiUrl} target="_blank" rel="noopener noreferrer" className={chip} style={{ borderColor: `${color}55`, color }}>
            ↗ {translate("characters.officialPage", lang)}
          </a>
        )}
      </div>
    </div>
  );

  const heroBox = (rounded: string) => (
    <div className={`relative aspect-[3/4] overflow-hidden ${rounded}`} style={{ background: `linear-gradient(180deg, ${color}20 0%, ${color}40 100%)` }}>
      {heroImage ? (
        <Image src={heroImage} alt={d.nameJp} fill sizes="320px" className="object-contain object-bottom" />
      ) : (
        <div className="w-full h-full flex items-center justify-center"><span className="text-8xl opacity-20">🎀</span></div>
      )}
    </div>
  );

  const unitBadge = unit ? (
    <Link href={`/units/${unit.slug}`} className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-medium text-white" style={{ background: unit.unitDetails.colorPrimary || color }}>
      {unitDisplay}
    </Link>
  ) : null;

  const backLabel = `← ${translate("nav.members", lang)}`;

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={0} unitLabel={primaryName} />
        <main className="flex-1 pb-20 overflow-y-auto">
          <div className="relative aspect-[3/4] max-h-[55vh]" style={{ background: `linear-gradient(180deg, ${color}30 0%, ${color}10 100%)` }}>
            {heroImage ? (
              <Image src={heroImage} alt={d.nameJp} fill sizes="100vw" className="object-contain object-bottom" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><span className="text-8xl opacity-20">🎀</span></div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: `linear-gradient(to top, var(--linkura-bg), transparent)` }} />
          </div>
          <div className="px-4 -mt-8 relative z-10">
            <h1 className="text-2xl font-bold" style={{ color }}>{primaryName}</h1>
            <p className="text-sm text-text-dim">{secondaryName}</p>
            {unitBadge}
            <div className="mt-4">{biodataCard}</div>
            {seiyuuBlock}
            {iconSigBlock}
            {bioBlock}
            {linksBlock}
          </div>
        </main>
        <BottomNav onBack={() => router.back()} onMenu={() => setMenuOpen(!menuOpen)} onHome={() => router.push("/")} menuOpen={menuOpen} />
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      {/* ===== TABLET ===== */}
      <div className="hidden sm:flex lg:hidden flex-1 min-h-screen bg-background">
        <div className="flex flex-1">
          <div className="w-2/5 relative" style={{ background: `linear-gradient(180deg, ${color}25 0%, ${color}10 100%)` }}>
            {heroImage ? (
              <Image src={heroImage} alt={d.nameJp} fill sizes="40vw" className="object-contain object-bottom" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><span className="text-8xl opacity-20">🎀</span></div>
            )}
          </div>
          <div className="w-3/5 p-6 overflow-y-auto">
            <Link href="/characters" className="text-xs text-text-dim hover:underline">{backLabel}</Link>
            <h1 className="text-3xl font-bold mt-3" style={{ color }}>{primaryName}</h1>
            <p className="text-base text-text-dim">{secondaryName}</p>
            {unitBadge}
            <div className="mt-5">{biodataCard}</div>
            {seiyuuBlock}
            {iconSigBlock}
            {bioBlock}
            {linksBlock}
          </div>
        </div>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <div className="max-w-5xl mx-auto w-full px-8 py-8">
          <Link href="/characters" className="text-sm text-text-dim hover:underline">{backLabel}</Link>
          <div className="flex gap-10 mt-6">
            <div className="w-80 shrink-0">
              {heroBox("rounded-2xl")}
              {iconSigBlock}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold" style={{ color }}>{primaryName}</h1>
              <p className="text-lg text-text-dim mt-1">{secondaryName}</p>
              {unitBadge}
              <div className="mt-6">{biodataCard}</div>
              {seiyuuBlock}
            </div>
          </div>
          {/* Mulai Profil: full-width dari margin kiri halaman (kolom kiri sudah selesai di atas) */}
          {bioBlock}
          {linksBlock}
        </div>
      </div>
    </>
  );
}
