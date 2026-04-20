"use client";

import Link from "next/link";
import Image from "next/image";

type CharacterCardProps = {
  slug: string;
  nameJp: string;
  nameRomaji: string;
  colorTheme: string | null;
  generation: string | null;
  seiyuu: string | null;
  unitName: string | null;
  unitColor: string | null;
  imageUrl: string | null;
  variant?: "compact" | "default";
};

export function CharacterCard({
  slug,
  nameJp,
  nameRomaji,
  colorTheme,
  generation,
  seiyuu,
  unitName,
  unitColor,
  imageUrl,
  variant = "default",
}: CharacterCardProps) {
  const color = colorTheme || "#8b82f5";

  return (
    <Link
      href={`/characters/${slug}`}
      className="group block rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
        border: `1.5px solid ${color}30`,
      }}
    >
      {/* Image area */}
      <div
        className="relative aspect-[3/4] overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${color}22 0%, ${color}44 100%)`,
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={nameJp}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-40">🎀</span>
          </div>
        )}

        {/* Unit badge */}
        {unitName && (
          <div
            className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
            style={{ background: unitColor || color }}
          >
            {unitName}
          </div>
        )}
      </div>

      {/* Info area */}
      <div className={`p-3 ${variant === "compact" ? "p-2" : "p-3"}`}>
        <h3
          className="font-bold text-base leading-tight"
          style={{ color }}
        >
          {nameJp}
        </h3>
        <p className="text-xs text-text-dim mt-0.5">{nameRomaji}</p>

        {variant === "default" && (
          <div className="flex items-center gap-2 mt-2 text-[11px] text-text-dim">
            {generation && <span>{generation}期生</span>}
            {seiyuu && (
              <>
                <span className="opacity-30">|</span>
                <span>CV: {seiyuu}</span>
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
