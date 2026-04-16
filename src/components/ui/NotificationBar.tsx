"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useState } from "react";
import { NostalgiaWidget } from "@/components/calendar/NostalgiaWidget";

/**
 * NotificationBar (Sample A) — swipe-down notification panel, ala HP.
 * Pull handle tepat di bawah StatusBar:
 *   - Swipe ke bawah → buka panel
 *   - Tap pill → buka panel (fallback)
 * Panel:
 *   - Swipe ke atas / tap backdrop / tombol close → tutup
 */
export function NotificationBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        drag="y"
        dragDirectionLock
        dragConstraints={{ top: 0, bottom: 60 }}
        dragElastic={0.4}
        dragMomentum={false}
        dragSnapToOrigin
        onDragEnd={(_, info: PanInfo) => {
          if (info.offset.y > 28 || info.velocity.y > 300) setOpen(true);
        }}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-label="Tarik ke bawah untuk buka notifikasi"
        className="absolute inset-x-0 top-9 z-20 h-7 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
      >
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/75 backdrop-blur-sm shadow-sm pointer-events-none">
          <span className="block w-10 h-1 rounded-full bg-[var(--linkura-text-dim)]/60" />
          <span className="text-[8px] text-[var(--linkura-text-dim)]/80 font-semibold tracking-wider">
            ↓ SWIPE
          </span>
        </span>
      </motion.div>

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
              drag="y"
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.25}
              dragMomentum={false}
              dragSnapToOrigin
              onDragEnd={(_, info: PanInfo) => {
                if (info.offset.y < -60 || info.velocity.y < -400) setOpen(false);
              }}
              className="absolute inset-x-0 top-0 z-40 bg-white/95 backdrop-blur-xl rounded-b-3xl shadow-2xl border-b border-[var(--linkura-border)] overflow-hidden touch-none"
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
              <div className="flex flex-col items-center py-1.5 bg-gradient-to-b from-transparent to-[var(--linkura-surface-2)]/40">
                <span className="block w-12 h-1 rounded-full bg-[var(--linkura-text-dim)]/40" />
                <span className="text-[8px] text-[var(--linkura-text-dim)]/70 mt-0.5 tracking-wider">
                  ↑ SWIPE UNTUK TUTUP
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
