"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type LinkuraPlayerProps = {
  /** YouTube video id (sumber utama). Kosong → coba mirror native. */
  videoId?: string;
  /** URL file video langsung (mirror, mis. Internet Archive) untuk fallback native HTML5. */
  mirrorUrl?: string;
  title?: string;
  accentColor?: string;
  thumbnailUrl?: string;
  hasSubtitleJp?: boolean;
  hasSubtitleId?: boolean;
  /** Mulai putar otomatis saat mount (dipakai PartPlayer setelah pop-up 再生確認 OK). */
  autoPlay?: boolean;
  /** Dipanggil saat video selesai (end-screen REPLAY/NEXT + autoplay-next di PartPlayer). */
  onEnded?: () => void;
};

/**
 * LinkuraPlayer — dispatcher player ala Linkura.
 * - Ada `videoId` → YouTube IFrame API (sumber utama, hemat bandwidth — ADR-002).
 * - Tidak ada YouTube tapi ada `mirrorUrl` → player native HTML5 (poin 5 & 6),
 *   sebagai cadangan bila YouTube bermasalah/takedown.
 */
export function LinkuraPlayer(props: LinkuraPlayerProps) {
  if (props.videoId) {
    return <YouTubeLinkuraPlayer {...props} videoId={props.videoId} />;
  }
  if (props.mirrorUrl) {
    return (
      <NativeLinkuraPlayer
        mirrorUrl={props.mirrorUrl}
        title={props.title}
        accentColor={props.accentColor}
        thumbnailUrl={props.thumbnailUrl}
        onEnded={props.onEnded}
        autoPlay={props.autoPlay}
      />
    );
  }
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-2 flex items-center justify-center">
      <span className="text-sm text-text-dim">動画は準備中です</span>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ───────────────────────── YouTube player ───────────────────────── */

// YouTube IFrame API types
interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  setVolume(volume: number): void;
  getVolume(): number;
  isMuted(): boolean;
  mute(): void;
  unMute(): void;
  destroy(): void;
  loadModule(module: string): void;
  getOptions(module?: string): string[];
  getOption(module: string, option: string): unknown;
  setOption(module: string, option: string, value: unknown): void;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: YTPlayerEvent) => void;
            onStateChange?: (event: YTPlayerEvent) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Load YouTube IFrame API once
let apiLoaded = false;
let apiReady = false;
const readyCallbacks: (() => void)[] = [];

function loadYouTubeAPI() {
  if (apiLoaded) return;
  apiLoaded = true;

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);

  window.onYouTubeIframeAPIReady = () => {
    apiReady = true;
    readyCallbacks.forEach((cb) => cb());
    readyCallbacks.length = 0;
  };
}

function onAPIReady(cb: () => void) {
  if (apiReady) {
    cb();
  } else {
    readyCallbacks.push(cb);
    loadYouTubeAPI();
  }
}

/**
 * YouTubeLinkuraPlayer — custom video player wrapping YouTube IFrame API.
 * Styled to feel like the Linkura app's native player.
 */
function YouTubeLinkuraPlayer({
  videoId,
  title,
  accentColor = "#8b82f5",
  thumbnailUrl,
  hasSubtitleJp,
  hasSubtitleId,
  autoPlay,
  onEnded,
}: LinkuraPlayerProps & { videoId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  // ref supaya callback terbaru terpanggil tanpa membuat ulang player YT
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerId = useRef(`lp-${videoId}-${Math.random().toString(36).slice(2, 6)}`);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [muted, setMuted] = useState(false);
  const [captionLang, setCaptionLang] = useState<"off" | "jp" | "id">("off");
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSubtitles = hasSubtitleJp || hasSubtitleId;

  const thumb = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const startProgressTracking = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime());
        const dur = playerRef.current.getDuration();
        if (dur > 0) setDuration(dur);
      }
    }, 250);
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  const initPlayer = useCallback(() => {
    onAPIReady(() => {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player(playerId.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: YTPlayerEvent) => {
            setDuration(event.target.getDuration());
            setPlaying(true);
            startProgressTracking();
          },
          onStateChange: (event: YTPlayerEvent) => {
            const state = event.data;
            if (state === window.YT.PlayerState.PLAYING) {
              setPlaying(true);
              startProgressTracking();
            } else if (state === window.YT.PlayerState.PAUSED) {
              setPlaying(false);
              stopProgressTracking();
            } else if (state === window.YT.PlayerState.ENDED) {
              setPlaying(false);
              stopProgressTracking();
              onEndedRef.current?.();
            }
          },
        },
      });
    });
  }, [videoId, startProgressTracking, stopProgressTracking]);

  useEffect(() => {
    return () => {
      stopProgressTracking();
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [stopProgressTracking]);

  // Autostart bila diminta (PartPlayer → setelah pop-up 再生確認 OK).
  const didAutoStart = useRef(false);
  useEffect(() => {
    if (autoPlay && !didAutoStart.current) {
      didAutoStart.current = true;
      setStarted(true);
      const id = setTimeout(initPlayer, 50);
      return () => clearTimeout(id);
    }
  }, [autoPlay, initPlayer]);

  const handlePlay = () => {
    if (!started) {
      setStarted(true);
      // Small delay to let the div render before YT.Player attaches
      setTimeout(initPlayer, 50);
    } else if (playerRef.current) {
      if (playing) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTime = pct * duration;
    playerRef.current.seekTo(seekTime, true);
    setCurrentTime(seekTime);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (playerRef.current.isMuted()) {
      playerRef.current.unMute();
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  };

  const cycleCaption = () => {
    if (!playerRef.current) return;
    const player = playerRef.current;
    try {
      player.loadModule("captions");
    } catch {
      // module may already be loaded
    }

    // Cycle: off → jp → id → off (only available langs)
    const langs: ("jp" | "id")[] = [];
    if (hasSubtitleJp) langs.push("jp");
    if (hasSubtitleId) langs.push("id");
    if (langs.length === 0) return;

    const langCodes: Record<string, string> = { jp: "ja", id: "id" };

    if (captionLang === "off") {
      const next = langs[0];
      try {
        player.setOption("captions", "track", { languageCode: langCodes[next] });
      } catch {
        // fallback
      }
      setCaptionLang(next);
    } else {
      const currentIdx = langs.indexOf(captionLang as "jp" | "id");
      const nextIdx = currentIdx + 1;
      if (nextIdx >= langs.length) {
        // Turn off
        try {
          player.setOption("captions", "track", {});
        } catch {
          // fallback
        }
        setCaptionLang("off");
      } else {
        const next = langs[nextIdx];
        try {
          player.setOption("captions", "track", { languageCode: langCodes[next] });
        } catch {
          // fallback
        }
        setCaptionLang(next);
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    if (playing) {
      hideTimeout.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Thumbnail / play button state (before video starts)
  if (!started) {
    return (
      <div
        className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer group"
        onClick={handlePlay}
        style={{ background: "#000" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt={title || "Video"}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"
            style={{ background: accentColor }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <polygon points="6,3 20,12 6,21" />
            </svg>
          </div>
        </div>

        {/* Title */}
        {title && (
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white text-sm font-medium truncate drop-shadow-lg">{title}</p>
          </div>
        )}

        {/* Linkura badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm">
          <span className="text-[10px] text-white/80 font-medium">LLLL Player</span>
        </div>
      </div>
    );
  }

  // Active player state
  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* YouTube player container */}
      <div id={playerId.current} className="absolute inset-0 w-full h-full" />

      {/* Click overlay for play/pause */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={handlePlay}
      />

      {/* Controls overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative px-3 pb-3 pt-8">
          {/* Progress bar */}
          <div
            className="w-full h-1 rounded-full bg-white/20 cursor-pointer mb-2 group/bar"
            onClick={handleSeek}
          >
            <div
              className="h-full rounded-full transition-all relative"
              style={{ width: `${progress}%`, background: accentColor }}
            >
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity"
                style={{ background: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
              />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePlay(); }}
              className="text-white hover:text-white/80 transition-colors cursor-pointer"
            >
              {playing ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              )}
            </button>

            {/* Time */}
            <span className="text-[11px] text-white/70 font-mono tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex-1" />

            {/* Subtitle toggle */}
            {hasSubtitles && (
              <button
                onClick={(e) => { e.stopPropagation(); cycleCaption(); }}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                  captionLang !== "off"
                    ? "text-white bg-white/25"
                    : "text-white/50 hover:text-white/80"
                }`}
                title={captionLang === "off" ? "字幕 ON" : captionLang === "jp" ? "日本語字幕" : "Subtitle ID"}
              >
                {captionLang === "off" ? "CC" : captionLang === "jp" ? "JP" : "ID"}
              </button>
            )}

            {/* Mute */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {muted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>

            {/* LLLL badge */}
            <span
              className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white/60"
              style={{ background: `${accentColor}40` }}
            >
              LLLL
            </span>
          </div>
        </div>
      </div>

      {/* Pause indicator (center) */}
      {!playing && started && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <polygon points="6,3 20,12 6,21" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────── Native HTML5 player (mirror) ───────────────────── */

/**
 * NativeLinkuraPlayer — fallback player untuk video yang di-host sendiri/mirror
 * (poin 5 & 6). Memakai elemen <video> dengan overlay kontrol bergaya sama.
 */
function NativeLinkuraPlayer({
  mirrorUrl,
  title,
  accentColor = "#8b82f5",
  thumbnailUrl,
  onEnded,
  autoPlay,
}: {
  mirrorUrl: string;
  title?: string;
  onEnded?: () => void;
  autoPlay?: boolean;
  accentColor?: string;
  thumbnailUrl?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStart = () => {
    setStarted(true);
    setTimeout(() => videoRef.current?.play().catch(() => {}), 50);
  };

  // Autostart (autoplay-next antar part / setelah 再生確認 OK).
  const didAutoStart = useRef(false);
  useEffect(() => {
    if (autoPlay && !didAutoStart.current) {
      didAutoStart.current = true;
      handleStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleFullscreen = () => {
    videoRef.current?.requestFullscreen?.().catch(() => {});
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    if (playing) {
      hideTimeout.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!started) {
    return (
      <div
        className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer group bg-black"
        onClick={handleStart}
      >
        {thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={title || "Video"}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"
            style={{ background: accentColor }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <polygon points="6,3 20,12 6,21" />
            </svg>
          </div>
        </div>
        {title && (
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white text-sm font-medium truncate drop-shadow-lg">{title}</p>
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm">
          <span className="text-[10px] text-white/80 font-medium">LLLL Player · Mirror</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={mirrorUrl}
        playsInline
        className="absolute inset-0 w-full h-full"
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); onEnded?.(); }}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
      />

      <div
        className={`absolute inset-x-0 bottom-0 z-20 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="relative px-3 pb-3 pt-8">
          <div
            className="w-full h-1 rounded-full bg-white/20 cursor-pointer mb-2 group/bar"
            onClick={handleSeek}
          >
            <div
              className="h-full rounded-full transition-all relative"
              style={{ width: `${progress}%`, background: accentColor }}
            >
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity"
                style={{ background: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="text-white hover:text-white/80 transition-colors cursor-pointer"
            >
              {playing ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              )}
            </button>

            <span className="text-[11px] text-white/70 font-mono tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex-1" />

            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {muted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleFullscreen(); }}
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="フルスクリーン"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            </button>

            <span
              className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white/60"
              style={{ background: `${accentColor}40` }}
            >
              LLLL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
