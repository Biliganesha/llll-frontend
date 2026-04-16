"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { NostalgiaWidget } from "@/components/calendar/NostalgiaWidget";

/**
 * NotificationBar — swipe-down notification panel style.
 * Default: hidden (hanya tampak indicator tipis di atas).
 * Klik/drag ke bawah: panel expand, tampilkan widget 今日の蓮の空.
 * Alternatif ke mini-widget di Home (Sample A).
 */
export function NotificationBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Buka notifikasi"
        className="absolute top-0 left-1/2 -translate-x-1/2 z-20 mt-1 px-4 py-0.5 rounded-full bg-white/70 backdrop-blur-sm shadow-sm active:scale-95 transition"
      >
        <span className="block w-10 h-1 rounded-full bg-[var(--linkura-text-dim)]/50" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              aria-hidden
              className="absolute inset-0 z-30 bg-black/10"
            />
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className="absolute inset-x-0 top-0 z-40 bg-white/95 backdrop-blur-xl rounded-b-3xl shadow-2xl border-b border-[var(--linkura-border)] overflow-hidden"
            >
              <div className="brand-gradient-bg px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-bold text-white drop-shadow">
                  🌸 通知
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/90 text-[11px] hover:text-white"
                  aria-label="Tutup"
                >
                  閉じる ×
                </button>
              </div>
              <NostalgiaWidget />
              <div className="flex justify-center py-1 bg-gradient-to-b from-transparent to-[var(--linkura-surface-2)]/40">
                <span className="block w-12 h-1 rounded-full bg-[var(--linkura-text-dim)]/40" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
