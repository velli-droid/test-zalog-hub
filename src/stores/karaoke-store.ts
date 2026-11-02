import { create } from 'zustand'

import { karaokeTrack } from '@/config/karaoke'
import { findLyric, findUpcomingLyric, type LyricLine } from '@/lib/karaoke'

type KaraokeStore = {
    lines: LyricLine[]
    activeLine: LyricLine | null
    upcomingLine: LyricLine | null
    playing: boolean
    started: boolean
    error: string | null
    volume: number
    muted: boolean
    setVolume: (volume: number) => void
    toggleMuted: () => void
    setLyrics: (lines: LyricLine[]) => void
    setPlaying: (playing: boolean) => void
    syncTime: (time: number) => void
    stop: () => void
    setError: (error: string | null) => void
}

// Karaoke is a temporary session; lyrics never enter the persisted task store.
export const useKaraokeStore = create<KaraokeStore>((set, get) => ({
    lines: [],
    activeLine: null,
    upcomingLine: null,
    playing: false,
    started: false,
    error: null,
    volume: 0.7,
    muted: false,
    setVolume: (volume) => {
        if (Number.isFinite(volume)) set({ volume: Math.min(1, Math.max(0, volume)), muted: false })
    },
    toggleMuted: () =>
        set((state) =>
            state.muted || state.volume === 0
                ? { muted: false, volume: state.volume || 0.7 }
                : { muted: true },
        ),
    setLyrics: (lines) => set({ lines, activeLine: null, upcomingLine: null, error: null }),
    setPlaying: (playing) => set((state) => ({ playing, started: state.started || playing })),
    syncTime: (time) => {
        const state = get()
        const activeLine = state.started ? findLyric(state.lines, time) : null
        const upcomingLine = state.started
            ? findUpcomingLyric(state.lines, time, karaokeTrack.previewSeconds)
            : null
        if (
            state.activeLine?.id !== activeLine?.id ||
            state.upcomingLine?.id !== upcomingLine?.id
        ) {
            set({ activeLine, upcomingLine })
        }
    },
    stop: () => set({ playing: false, started: false, activeLine: null, upcomingLine: null }),
    setError: (error) => set({ error }),
}))
