"use client";

import { useEffect, useState } from "react";

/**
 * collection.ts — loader manifest koleksi (stiker/komik/musik).
 * Data game sudah BEKU (server tutup 2026-06-30) → manifest = snapshot final,
 * disimpan statis di public/collection/*.json; gambar di-hotlink dari uploads
 * CMS (`/wp-content/uploads/llll-col/...`) — file statis tanpa attachment WP.
 * Migrasi ke object storage (R2) nanti = cukup ganti origin di cmsBase().
 */

export type CollectionItem = {
  id: string;
  /** nama file webp */
  f: string;
  w: number;
  h: number;
  /** nama JP dari masterdata (null = tidak ditemukan, tampilkan id) */
  name: string | null;
  desc?: string | null;
  /** kategori stiker: ippan | sukusute | tokubetsu | sonota */
  cat?: string;
  /** file thumbnail (komik; berada di folder `<base>-thumb/`) */
  thumb?: string;
  /** file thumbnail lyric video (musik; berada di folder saudara `lyric/`) */
  lyric?: string;
};

export type CollectionManifest = {
  v: number;
  count: number;
  /** path relatif di origin CMS, mis. /wp-content/uploads/llll-col/sticker */
  base: string;
  items: CollectionItem[];
};

/** Origin CMS diturunkan dari endpoint GraphQL (localhost saat dev, cms.* saat produksi). */
export function cmsBase(): string {
  const gql =
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
    "https://cms.hasunosora-daisouko.com/graphql";
  return gql.replace(/\/graphql\/?$/, "");
}

export function imgUrl(manifest: CollectionManifest, file: string): string {
  return `${cmsBase()}${manifest.base}/${file}`;
}

/** URL thumbnail komik — file berada di folder `<base>-thumb/`. */
export function thumbUrl(manifest: CollectionManifest, file: string): string {
  return `${cmsBase()}${manifest.base}-thumb/${file}`;
}

/** URL thumbnail lyric video — folder saudara `lyric/` di samping `music/`. */
export function lyricUrl(manifest: CollectionManifest, file: string): string {
  return `${cmsBase()}${manifest.base.replace(/\/music$/, "/lyric")}/${file}`;
}

const cache = new Map<string, CollectionManifest>();

/** Muat manifest dari public/collection/<name>.json (di-cache per sesi). */
export function useManifest(name: "sticker" | "comic" | "music") {
  const [data, setData] = useState<CollectionManifest | null>(cache.get(name) ?? null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache.has(name)) return;
    let alive = true;
    fetch(`/collection/manifest-${name}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`manifest ${name}: HTTP ${r.status}`);
        return r.json();
      })
      .then((j: CollectionManifest) => {
        cache.set(name, j);
        if (alive) setData(j);
      })
      .catch((e) => alive && setError(String(e)));
    return () => {
      alive = false;
    };
  }, [name]);

  return { data, error };
}
