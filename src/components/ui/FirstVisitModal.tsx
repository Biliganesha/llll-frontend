"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/language";
import { ABOUT_SECTIONS, MISSION_JP, MISSION_ID } from "@/lib/site-content";

/**
 * FirstVisitModal — gerbang "Terms & Conditions" yang tampil SETIAP kunjungan
 * (tiap situs dibuka/refresh, poin 17). Menampilkan misi + 免責事項 + 権利者の皆様へ
 * supaya pengunjung langsung membaca disclaimer tanpa harus membuka menu About.
 * Tidak disimpan ke localStorage — sengaja muncul lagi tiap kali halaman dimuat penuh.
 */
/** Greeting berdasarkan jam lokal user (browser timezone — tiap wilayah beda). */
function timeGreeting(hour: number): { jp: string; id: string } {
  if (hour >= 5 && hour < 11) return { jp: "おはようございます", id: "Selamat pagi" };
  if (hour >= 11 && hour < 15) return { jp: "こんにちは", id: "Selamat siang" };
  if (hour >= 15 && hour < 18) return { jp: "こんにちは", id: "Selamat sore" };
  return { jp: "こんばんは", id: "Selamat malam" };
}

export function FirstVisitModal() {
  const { lang, setLang, t } = useLanguage();
  const [show, setShow] = useState(false);
  const [greet, setGreet] = useState<{ jp: string; id: string }>({ jp: "ようこそ", id: "Selamat datang" });

  useEffect(() => {
    // Tampil tiap kali komponen mount (= tiap full page load / kunjungan baru).
    setShow(true);
    setGreet(timeGreeting(new Date().getHours())); // jam lokal browser user
  }, []);

  const accept = () => {
    setShow(false);
  };

  const disclaimer = ABOUT_SECTIONS.find((s) => s.id === "disclaimer")!;
  const rights = ABOUT_SECTIONS.find((s) => s.id === "rights-holders")!;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="brand-gradient-bg px-5 py-3 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-base font-bold text-white drop-shadow leading-tight">
                  {greet.jp} · {greet.id}
                </h2>
                <p className="text-[11px] text-white/85 leading-tight">
                  Link! Like! Library! Legacy!
                </p>
              </div>
              <button
                onClick={() => setLang(lang === "jp" ? "id" : "jp")}
                className="px-2 py-1 rounded-full bg-white/30 hover:bg-white/50 text-[10px] font-bold text-white transition cursor-pointer shrink-0"
              >
                {lang === "jp" ? "JP → ID" : "ID → JP"}
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 overflow-y-auto space-y-4">
              <p
                className="text-sm text-center italic rounded-xl p-3"
                style={{ background: "linear-gradient(135deg, #fff0f5, #f0eaff)", color: "var(--linkura-primary)" }}
              >
                {t(MISSION_JP, MISSION_ID)}
              </p>

              <section>
                <h3 className="text-sm font-bold mb-1">{t(disclaimer.titleJp, disclaimer.titleId)}</h3>
                <p className="text-xs leading-relaxed text-foreground/80">
                  {t(disclaimer.contentJp, disclaimer.contentId)}
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold mb-1">{t(rights.titleJp, rights.titleId)}</h3>
                <p className="text-xs leading-relaxed text-foreground/80 whitespace-pre-line">
                  {t(rights.contentJp, rights.contentId)}
                </p>
              </section>

              <p className="text-[11px] text-text-dim">
                {t(
                  "詳しくは「このサイトについて」をご覧ください。",
                  "Selengkapnya lihat halaman “Tentang Website Ini”."
                )}{" "}
                <Link href="/about" onClick={accept} className="text-primary hover:underline font-medium">
                  {t("このサイトについて", "Tentang")} →
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border shrink-0">
              <button
                onClick={accept}
                className="w-full py-2.5 rounded-xl brand-gradient-bg text-white text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition cursor-pointer"
              >
                {t("理解しました", "Saya mengerti")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
