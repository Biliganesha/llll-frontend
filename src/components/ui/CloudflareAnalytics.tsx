import Script from "next/script";

/**
 * CloudflareAnalytics — beacon Cloudflare Web Analytics (tanpa cookie).
 * Hanya dimuat bila env `NEXT_PUBLIC_CF_BEACON_TOKEN` diisi; tanpa token,
 * komponen ini diam total sehingga situs tetap aman/bersih.
 *
 * Cara mengaktifkan: Cloudflare Dashboard → Analytics & Logs → Web Analytics →
 * Add a site (www.hasunosora-daisouko.com) → salin nilai `token` dari snippet →
 * Vercel → Settings → Environment Variables → NEXT_PUBLIC_CF_BEACON_TOKEN.
 */
export function CloudflareAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  if (!token) return null;

  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
