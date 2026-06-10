"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/language";

type SeiyuuCardProps = {
  slug: string;
  nameJp: string;
  nameRomaji: string;
  photoUrl: string | null;
  charNameJp: string | null;
  charNameRomaji: string | null;
};

export function SeiyuuCard({
  slug,
  nameJp,
  nameRomaji,
  photoUrl,
  charNameJp,
  charNameRomaji,
}: SeiyuuCardProps) {
  const { lang } = useLanguage();
  const primaryName = lang === "jp" ? nameJp : nameRomaji || nameJp;
  const secondaryName = lang === "jp" ? nameRomaji : nameJp;
  const role = lang === "jp" ? charNameJp : charNameRomaji || charNameJp;

  return (
    <Link
      href={`/seiyuu/${slug}`}
      className="group block rounded-2xl overflow-hidden border border-border bg-surface/40 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-surface">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={nameJp}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-30">🎤</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm leading-tight">{primaryName}</h3>
        <p className="text-xs text-text-dim mt-0.5">{secondaryName}</p>
        {role && <p className="text-[11px] text-text-dim mt-1.5 truncate">CV: {role}</p>}
      </div>
    </Link>
  );
}
