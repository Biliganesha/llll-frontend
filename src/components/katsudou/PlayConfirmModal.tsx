"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/language";
import type { Orientation, PlaybackPrefs } from "@/lib/playback";

/**
 * PlayConfirmModal — pop-up 再生確認 ala app Linkura
 * (ref: docs/LINKURA_UI_KATSUDOU.md → "Pop-up 再生確認 sebelum play part").
 *
 * Controlled: state preferensi dimiliki parent (PartPlayer) via usePlaybackPrefs,
 * supaya satu sumber kebenaran (tidak ada instance prefs yang saling tak sinkron).
 */
type Props = {
  open: boolean;
  partLabel?: string;
  autoplayNext: boolean;
  orientation: Orientation;
  onChange: (patch: Partial<PlaybackPrefs>) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export function PlayConfirmModal({
  open,
  partLabel,
  autoplayNext,
  orientation,
  onChange,
  onCancel,
  onConfirm,
}: Props) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="play-confirm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
        >
          <button
            aria-hidden
            tabIndex={-1}
            onClick={onCancel}
            className="absolute inset-0 bg-black/50 cursor-default"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 24, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="relative w-full max-w-sm rounded-3xl bg-white overflow-hidden shadow-xl"
          >
            {/* Header banner ala app */}
            <div
              className="px-4 py-3 text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg,#6a7bff,#a88dff)" }}
            >
              {t("再生確認", "Konfirmasi Putar")}
            </div>

            {/* Body */}
            <div className="p-4 space-y-4 text-foreground">
              <p className="text-sm font-medium">
                {t("ストーリーを再生しますか？", "Putar cerita ini?")}
                {partLabel ? (
                  <span className="block text-xs text-text-dim mt-0.5">{partLabel}</span>
                ) : null}
              </p>

              {/* Checkbox: 続けて再生 (autoplay next) */}
              <button
                type="button"
                onClick={() => onChange({ autoplayNext: !autoplayNext })}
                className="w-full flex items-start gap-3 text-left"
              >
                <span
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                    autoplayNext ? "border-transparent" : "border-border bg-white"
                  }`}
                  style={autoplayNext ? { background: "#6a7bff" } : undefined}
                >
                  {autoplayNext && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span className="text-xs leading-snug">
                  {t("視聴可能なストーリーを続けて見る", "Lanjut otomatis ke part berikutnya")}
                </span>
              </button>

              {/* Pilihan orientasi: 縦画面 / 横画面 */}
              <div>
                <p className="text-[11px] font-bold text-text-dim mb-1.5">
                  {t("画面の向き", "Orientasi layar")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(["portrait", "landscape"] as const).map((o) => {
                    const active = orientation === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() => onChange({ orientation: o })}
                        className={`py-2 rounded-xl text-xs font-medium border transition ${
                          active ? "text-white border-transparent" : "border-border bg-white text-foreground"
                        }`}
                        style={active ? { background: "#6a7bff" } : undefined}
                      >
                        {o === "portrait" ? t("縦画面", "Potret") : t("横画面", "Lanskap")}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer: キャンセル / OK */}
            <div className="p-3 grid grid-cols-2 gap-2 border-t border-border">
              <button
                onClick={onCancel}
                className="py-2.5 rounded-xl bg-surface-2 text-sm font-medium hover:bg-surface-2/70 transition"
              >
                {t("キャンセル", "Batal")}
              </button>
              <button
                onClick={onConfirm}
                className="py-2.5 rounded-xl text-white text-sm font-bold transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#6a7bff,#a88dff)" }}
              >
                OK
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
