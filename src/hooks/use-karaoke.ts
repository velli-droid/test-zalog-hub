import { useEffect, useRef, useState } from 'react'

import { karaokeTrack } from '@/config/karaoke'
import { parseLrc } from '@/lib/karaoke'
import { useKaraokeStore } from '@/stores/karaoke-store'

export function useKaraoke() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const requestRef = useRef<AbortController | null>(null)
    const [loading, setLoading] = useState(false)
    const playing = useKaraokeStore((state) => state.playing)
    const started = useKaraokeStore((state) => state.started)
    const error = useKaraokeStore((state) => state.error)
    const volume = useKaraokeStore((state) => state.volume)
    const muted = useKaraokeStore((state) => state.muted)
    const setVolume = useKaraokeStore((state) => state.setVolume)
    const toggleMuted = useKaraokeStore((state) => state.toggleMuted)

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
            audioRef.current.muted = muted
        }
    }, [volume, muted])

    function changeVolume(values: number[]) {
        if (values[0] !== undefined) setVolume(values[0] / 100)
    }

    useEffect(() => {
        const audio = audioRef.current
        return () => {
            requestRef.current?.abort()
            audio?.pause()
            useKaraokeStore.getState().stop()
        }
    }, [])

    useEffect(() => {
        if (!playing) return
        let frame: number
        function tick() {
            if (audioRef.current) useKaraokeStore.getState().syncTime(audioRef.current.currentTime)
            frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [playing])

    function stop() {
        requestRef.current?.abort()
        setLoading(false)
        const audio = audioRef.current
        if (audio) {
            audio.pause()
            audio.currentTime = 0
        }
        useKaraokeStore.getState().stop()
    }

    async function togglePlayback() {
        const audio = audioRef.current
        if (!audio || loading) return
        if (!audio.paused) {
            audio.pause()
            return
        }
        const controller = new AbortController()
        requestRef.current = controller
        useKaraokeStore.getState().setError(null)
        setLoading(true)

        try {
            if (!useKaraokeStore.getState().lines.length) {
                const response = await fetch(karaokeTrack.lyricsSrc, { signal: controller.signal })
                if (!response.ok)
                    throw new Error('Не найден файл public/karaoke/dora-vtyurilas.lrc.')
                const lines = parseLrc(await response.text())
                if (controller.signal.aborted) return
                if (!lines.some((line) => line.text)) {
                    throw new Error(
                        'Добавьте LRC с таймингами [00:12.50] в public/karaoke/dora-vtyurilas.lrc.',
                    )
                }
                useKaraokeStore.getState().setLyrics(lines)
            }
            if (controller.signal.aborted) return
            if (audio.error) audio.load()
            if (audio.ended) audio.currentTime = 0
            await audio.play()
            // A stop may have happened while the browser was preparing playback.
            if (controller.signal.aborted && requestRef.current === controller) audio.pause()
        } catch (cause) {
            if (!controller.signal.aborted) {
                useKaraokeStore
                    .getState()
                    .setError(
                        (cause instanceof Error && cause.message.includes('LRC')) ||
                            (cause instanceof Error && cause.message.includes('.lrc'))
                            ? cause.message
                            : 'Не удалось запустить песню. Проверьте public/karaoke/dora-vtyurilas.mp3 и нажмите запуск ещё раз.',
                    )
            }
        } finally {
            if (requestRef.current === controller) setLoading(false)
        }
    }

    function syncTime() {
        if (audioRef.current) useKaraokeStore.getState().syncTime(audioRef.current.currentTime)
    }

    return {
        audioRef,
        playing,
        started,
        loading,
        error,
        volumePercent: muted ? 0 : Math.round(volume * 100),
        silent: muted || volume === 0,
        changeVolume,
        toggleMuted,
        togglePlayback,
        stop,
        syncTime,
        onPlay: () => {
            useKaraokeStore.getState().setPlaying(true)
            syncTime()
        },
        onPause: () => useKaraokeStore.getState().setPlaying(false),
        onEnded: () => useKaraokeStore.getState().stop(),
        onError: () => {
            useKaraokeStore.getState().stop()
            useKaraokeStore
                .getState()
                .setError(
                    'Не удалось прочитать public/karaoke/dora-vtyurilas.mp3. Проверьте файл песни.',
                )
        },
    }
}
