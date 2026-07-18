"use client";

import { useCallback, useEffect, useState } from "react";

/* =========================================================================
 * Playback preferences (再生確認 popup)
 * Faithful to the Linkura app's "再生確認" dialog:
 *  - 続けて再生 (autoplay next part)
 *  - 縦画面 / 横画面 (portrait / landscape)
 * Persisted in localStorage so the choice sticks across visits.
 * ====================================================================== */
export type Orientation = "portrait" | "landscape";
export type PlaybackPrefs = {
  autoplayNext: boolean;
  orientation: Orientation;
};

const PREFS_KEY = "llll-playback-prefs";
const DEFAULT_PREFS: PlaybackPrefs = { autoplayNext: true, orientation: "landscape" };

export function usePlaybackPrefs() {
  const [prefs, setPrefs] = useState<PlaybackPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<PlaybackPrefs>;
      setPrefs({
        autoplayNext:
          typeof parsed.autoplayNext === "boolean" ? parsed.autoplayNext : DEFAULT_PREFS.autoplayNext,
        orientation:
          parsed.orientation === "portrait" || parsed.orientation === "landscape"
            ? parsed.orientation
            : DEFAULT_PREFS.orientation,
      });
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const update = useCallback((patch: Partial<PlaybackPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { prefs, update };
}

/* =========================================================================
 * Watched parts (✓ penanda "視聴済み" per part)
 * Stores the set of part databaseIds the user has opened/played.
 * ====================================================================== */
const WATCHED_KEY = "llll-watched-parts";

export function useWatchedParts() {
  const [watched, setWatched] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WATCHED_KEY);
      if (!raw) return;
      const arr = JSON.parse(raw) as unknown;
      if (Array.isArray(arr)) {
        setWatched(new Set(arr.filter((n): n is number => typeof n === "number")));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((set: Set<number>) => {
    try {
      localStorage.setItem(WATCHED_KEY, JSON.stringify([...set]));
    } catch {
      /* ignore */
    }
  }, []);

  const markWatched = useCallback(
    (id: number) => {
      setWatched((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const toggleWatched = useCallback(
    (id: number) => {
      setWatched((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const isWatched = useCallback((id: number) => watched.has(id), [watched]);

  return { watched, isWatched, markWatched, toggleWatched };
}
