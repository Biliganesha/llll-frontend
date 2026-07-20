import type { MetadataRoute } from "next";

const SITE = "https://www.hasunosora-daisouko.com";
const GQL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
  "https://cms.hasunosora-daisouko.com/graphql";

/** Rute tetap — selalu ada meski CMS tak terjangkau saat build. */
const STATIC_PATHS = [
  "",
  "/katsudou-kiroku",
  "/sukukone",
  "/collection",
  "/collection/sticker",
  "/collection/comic",
  "/collection/music",
  "/calendar",
  "/timeline",
  "/characters",
  "/units",
  "/seiyuu",
  "/relationships",
  "/gameplay",
  "/search",
  "/about",
];

const QUERY = `{
  storyChapters(first: 50) { nodes { slug } }
  episodes(first: 500) { nodes { slug } }
  sukukoneVideos(first: 500) { nodes { slug } }
  characters(first: 50) { nodes { slug } }
  seiyuus(first: 50) { nodes { slug } }
  units(first: 20) { nodes { slug } }
}`;

type Nodes = { nodes: { slug: string | null }[] };

/** Sitemap di-refresh tiap jam (konten arsip nyaris statis). */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  try {
    const res = await fetch(GQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY }),
      next: { revalidate },
    });
    if (!res.ok) return base;

    const json = (await res.json()) as {
      data?: Record<string, Nodes | undefined>;
    };
    const d = json.data ?? {};
    const add = (key: string, prefix: string, priority = 0.6) =>
      (d[key]?.nodes ?? [])
        .map((n) => n.slug)
        .filter((s): s is string => !!s)
        .map((slug) => ({
          url: `${SITE}${prefix}/${encodeURIComponent(slug)}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority,
        }));

    return [
      ...base,
      ...add("storyChapters", "/katsudou-kiroku", 0.8),
      ...add("episodes", "/katsudou-kiroku/ep", 0.7),
      ...add("sukukoneVideos", "/sukukone", 0.6),
      ...add("characters", "/characters", 0.7),
      ...add("seiyuus", "/seiyuu", 0.5),
      ...add("units", "/units", 0.6),
    ];
  } catch {
    // CMS tak terjangkau saat build → sitemap tetap terbit dengan rute tetap.
    return base;
  }
}
