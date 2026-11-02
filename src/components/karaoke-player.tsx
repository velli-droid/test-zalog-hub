import { LoaderCircle, Music2, Pause, Play, Square, Volume2, VolumeX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { karaokeTrack } from '@/config/karaoke'
import { useKaraoke } from '@/hooks/use-karaoke'

export function KaraokePlayer() {
    const {
        loading,
        togglePlayback,
        playing,
        started,
        stop,
        audioRef,
        onPlay,
        onPause,
        onEnded,
        onError,
        syncTime,
        error,
        volumePercent,
        silent,
        changeVolume,
        toggleMuted,
    } = useKaraoke()

    return (
        <section className="karaoke-player" aria-label="Караоке">
            <div className="karaoke-heading">
                <Music2 size={17} />
                <h3>Спойте в караоке: {karaokeTrack.title}</h3>
            </div>
            <p>
                Нажмите «Начать караоке» и подпевайте. Текущая строка выделена, а следующая появится
                за {karaokeTrack.previewSeconds} секунды до начала.
            </p>
            <div className="karaoke-actions">
                <Button type="button" disabled={loading} onClick={togglePlayback}>
                    {loading ? (
                        <LoaderCircle
                            size={15}
                            className="animate-spin motion-reduce:animate-none"
                        />
                    ) : playing ? (
                        <Pause size={15} />
                    ) : (
                        <Play size={15} />
                    )}
                    {loading
                        ? 'Загрузка…'
                        : playing
                          ? 'Пауза'
                          : started
                            ? 'Продолжить'
                            : 'Начать караоке'}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    disabled={!started && !loading}
                    onClick={stop}
                >
                    <Square size={14} /> Стоп
                </Button>
            </div>
            <div className="karaoke-volume" role="group" aria-label="Громкость караоке">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={toggleMuted}
                    aria-label={silent ? 'Включить звук' : 'Выключить звук'}
                    title={silent ? 'Включить звук' : 'Выключить звук'}
                >
                    {silent ? <VolumeX size={17} /> : <Volume2 size={17} />}
                </Button>
                <span className="volume-label">Громкость</span>
                <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[volumePercent]}
                    onValueChange={changeVolume}
                    aria-label="Громкость песни"
                    aria-valuetext={`${volumePercent}%`}
                />
                <output className="volume-value" aria-label="Уровень громкости">
                    {volumePercent}%
                </output>
            </div>
            <audio
                ref={audioRef}
                src={karaokeTrack.audioSrc}
                preload="none"
                onPlay={onPlay}
                onPause={onPause}
                onEnded={onEnded}
                onError={onError}
                onTimeUpdate={syncTime}
                onSeeked={syncTime}
            />
            {error && (
                <p className="karaoke-error" role="alert">
                    {error}
                </p>
            )}
        </section>
    )
}
