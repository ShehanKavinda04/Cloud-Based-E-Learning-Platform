import { useEffect, useRef, useState } from "react"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
} from "lucide-react"
import { cn } from "@/lib/utils"

const QUALITIES = ["Auto", "1080p", "720p", "480p", "360p"]
const SPEEDS = [0.5, 1, 1.25, 1.5, 2]

// A royalty-free sample stream to demonstrate real playback.
const SAMPLE_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

function formatTime(t: number) {
  if (!Number.isFinite(t)) return "0:00"
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function VideoPlayer({ title }: { title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [quality, setQuality] = useState("Auto")
  const [speed, setSpeed] = useState(1)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => setCurrent(v.currentTime)
    const onMeta = () => setDuration(v.duration)
    const onEnd = () => setPlaying(false)
    v.addEventListener("timeupdate", onTime)
    v.addEventListener("loadedmetadata", onMeta)
    v.addEventListener("ended", onEnd)
    return () => {
      v.removeEventListener("timeupdate", onTime)
      v.removeEventListener("loadedmetadata", onMeta)
      v.removeEventListener("ended", onEnd)
    }
  }, [])

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const v = videoRef.current
    if (!v) return
    const t = (Number(e.target.value) / 100) * duration
    v.currentTime = t
    setCurrent(t)
  }

  function skip(delta: number) {
    const v = videoRef.current
    if (!v) return
    v.currentTime = Math.min(duration, Math.max(0, v.currentTime + delta))
  }

  function toggleMute() {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  function changeSpeed(s: number) {
    const v = videoRef.current
    if (!v) return
    v.playbackRate = s
    setSpeed(s)
  }

  function fullscreen() {
    containerRef.current?.requestFullscreen?.()
  }

  const pct = duration ? (current / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-dark shadow-lg"
    >
      <video
        ref={videoRef}
        src={SAMPLE_SRC}
        crossOrigin="anonymous"
        className="h-full w-full"
        onClick={togglePlay}
        playsInline
      />

      {/* Center play button */}
      {!playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-dark/30 transition-opacity duration-300"
          aria-label="Play video"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 shadow-xl transition-transform duration-300 hover:scale-105">
            <Play className="ml-1 h-9 w-9 text-primary-foreground" fill="currentColor" />
          </span>
        </button>
      )}

      {/* ABS badge */}
      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-dark/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
        Adaptive Streaming &middot; {quality}
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark/90 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {/* Scrubber */}
        <input
          type="range"
          min={0}
          max={100}
          value={pct}
          onChange={seek}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-primary"
          style={{
            background: `linear-gradient(to right, #4F46E5 ${pct}%, rgba(255,255,255,0.3) ${pct}%)`,
          }}
          aria-label="Seek"
        />

        <div className="mt-2 flex items-center gap-3 text-white">
          <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button onClick={() => skip(-10)} aria-label="Rewind 10 seconds">
            <SkipBack className="h-5 w-5" />
          </button>
          <button onClick={() => skip(10)} aria-label="Forward 10 seconds">
            <SkipForward className="h-5 w-5" />
          </button>
          <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>

          <span className="text-xs tabular-nums text-slate-200">
            {formatTime(current)} / {formatTime(duration)}
          </span>

          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowSettings((s) => !s)}
                aria-label="Settings"
                className={cn("transition-transform", showSettings && "rotate-90")}
              >
                <Settings className="h-5 w-5" />
              </button>
              {showSettings && (
                <div className="absolute bottom-8 right-0 w-44 rounded-xl bg-dark/95 p-3 text-xs shadow-xl backdrop-blur-md">
                  <p className="mb-1.5 font-semibold text-slate-400">Quality</p>
                  <div className="mb-3 grid grid-cols-3 gap-1">
                    {QUALITIES.map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className={cn(
                          "rounded-md px-2 py-1 transition-colors",
                          quality === q ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20",
                        )}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <p className="mb-1.5 font-semibold text-slate-400">Speed</p>
                  <div className="grid grid-cols-3 gap-1">
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        onClick={() => changeSpeed(s)}
                        className={cn(
                          "rounded-md px-2 py-1 transition-colors",
                          speed === s ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20",
                        )}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={fullscreen} aria-label="Fullscreen">
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <span className="sr-only">{title}</span>
    </div>
  )
}
