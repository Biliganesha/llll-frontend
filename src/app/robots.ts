import type { MetadataRoute } from "next";

const SITE = "https://www.hasunosora-daisouko.com";

/**
 * robots.txt — dapat direm sewaktu-waktu.
 * Set env `NEXT_PUBLIC_BLOCK_INDEXING=true` (di Vercel) bila arsip ingin
 * disembunyikan dari mesin pencari, mis. selama masa pengembangan atau saat
 * sumber video masih menumpang CDN pihak lain. Tanpa env itu, perilakunya
 * sama seperti sebelumnya: boleh diindeks.
 */
export default function robots(): MetadataRoute.Robots {
  const blocked = process.env.NEXT_PUBLIC_BLOCK_INDEXING === "true";

  if (blocked) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // halaman utilitas, tak ada gunanya di hasil pencarian
        disallow: ["/search"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
