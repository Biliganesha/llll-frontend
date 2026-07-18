"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { SeiyuuCard } from "@/components/seiyuu/SeiyuuCard";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language";
import { translate } from "@/lib/translations";

const GET_SEIYUUS = gql`
  query GetSeiyuus {
    seiyuus(first: 50) {
      nodes {
        slug
        seiyuuProfile {
          nameJp
          nameRomaji
          photo {
            node {
              sourceUrl
            }
          }
          character {
            nodes {
              ... on Character {
                characterDetails {
                  nameJp
                  nameRomaji
                }
              }
            }
          }
        }
      }
    }
  }
`;

type SeiyuuNode = {
  slug: string;
  seiyuuProfile: {
    nameJp: string;
    nameRomaji: string;
    photo: { node: { sourceUrl: string } } | null;
    character: {
      nodes: { characterDetails: { nameJp: string; nameRomaji: string } }[];
    } | null;
  };
};

type PageData = { seiyuus: { nodes: SeiyuuNode[] } };

export default function SeiyuuListPage() {
  const { data, loading } = useQuery<PageData>(GET_SEIYUUS);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { lang } = useLanguage();
  const tr = (jp: string, id: string) => (lang === "jp" ? jp : id);

  const seiyuus = data?.seiyuus?.nodes ?? [];

  const cards = seiyuus.map((s) => {
    const ch = s.seiyuuProfile.character?.nodes?.[0]?.characterDetails ?? null;
    return (
      <SeiyuuCard
        key={s.slug}
        slug={s.slug}
        nameJp={s.seiyuuProfile.nameJp}
        nameRomaji={s.seiyuuProfile.nameRomaji}
        photoUrl={s.seiyuuProfile.photo?.node.sourceUrl ?? null}
        charNameJp={ch?.nameJp ?? null}
        charNameRomaji={ch?.nameRomaji ?? null}
      />
    );
  });

  const subtitle = tr(
    "蓮ノ空女学院スクールアイドルクラブのキャスト",
    "Para pengisi suara (cast) Klub School Idol SMA Putri Hasunosora"
  );

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen wallpaper-default relative">
        <StatusBar episodeCount={seiyuus.length} unitLabel={tr("声優", "Seiyuu")} />
        <main className="flex-1 px-3 pt-3 pb-20">
          <h1 className="text-xl font-bold brand-gradient-text mb-1">{tr("声優", "Seiyuu")}</h1>
          <p className="text-xs text-text-dim mb-3">{subtitle}</p>
          {loading ? (
            <p className="text-text-dim text-sm">{translate("common.loading", lang)}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">{cards}</div>
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

      {/* ===== TABLET / DESKTOP ===== */}
      <div className="hidden sm:block flex-1 min-h-screen bg-background">
        <div className="max-w-6xl mx-auto w-full px-6 lg:px-8 py-8">
          <h1 className="text-2xl lg:text-4xl font-bold brand-gradient-text">{tr("声優", "Seiyuu")}</h1>
          <p className="text-sm lg:text-base text-text-dim mt-1">{subtitle}</p>
          {loading ? (
            <p className="text-text-dim mt-6">{translate("common.loading", lang)}</p>
          ) : (
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5 mt-6">{cards}</div>
          )}
        </div>
      </div>
    </>
  );
}
