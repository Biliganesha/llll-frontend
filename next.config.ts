import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js 16 memblok optimasi gambar dari localhost/IP lokal (proteksi SSRF).
    // Saat dev (CMS di localhost/XAMPP) → serve apa adanya. Produksi (CMS publik) tetap dioptimasi.
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cms.hasunosora-daisouko.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "**.wp.com",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
    ],
  },
};

export default nextConfig;
