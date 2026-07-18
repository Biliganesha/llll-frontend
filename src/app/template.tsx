"use client";

import { motion } from "framer-motion";

/**
 * Template root — transisi "buka app" tiap navigasi route (fidelity Linkura:
 * berpindah layar terasa seperti membuka aplikasi dari home OS, bukan ganti
 * halaman web). Template di-remount tiap navigasi sehingga animasi enter
 * selalu berjalan; ringan (opacity+scale, 200ms) agar tidak mengganggu.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
      className="flex-1 flex flex-col min-h-screen"
    >
      {children}
    </motion.div>
  );
}
