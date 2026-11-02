export type LyricLine = { id: string; time: number; text: string }

export function parseLrc(source: string): LyricLine[] {
    const offset = Number(source.match(/\[offset:\s*(-?\d+)\]/i)?.[1] ?? 0) / 1000
    const lines: LyricLine[] = []

    for (const row of source.split(/\r?\n/)) {
        const timestamps = [...row.matchAll(/\[(\d+):([0-5]\d)(?:\.(\d{1,3}))?\]/g)]
        const text = row.replace(/\[[^\]]*\]/g, '').trim()

        for (const timestamp of timestamps) {
            const time = Math.max(
                0,
                Number(timestamp[1]) * 60 +
                    Number(timestamp[2]) +
                    Number(`0.${timestamp[3] ?? '0'}`) +
                    offset,
            )
            lines.push({ id: `lyric-${lines.length}`, time, text })
        }
    }

    return lines.sort((a, b) => a.time - b.time)
}

export function findLyric(lines: LyricLine[], time: number): LyricLine | null {
    let left = 0
    let right = lines.length - 1
    let result: LyricLine | null = null

    while (left <= right) {
        const middle = Math.floor((left + right) / 2)
        if (lines[middle].time <= time) {
            result = lines[middle]
            left = middle + 1
        } else {
            right = middle - 1
        }
    }

    return result?.text ? result : null
}

export function findUpcomingLyric(
    lines: LyricLine[],
    time: number,
    previewSeconds: number,
): LyricLine | null {
    let left = 0
    let right = lines.length

    // Find the first cue strictly after the current playback position.
    while (left < right) {
        const middle = Math.floor((left + right) / 2)
        if (lines[middle].time <= time) left = middle + 1
        else right = middle
    }

    for (let index = left; index < lines.length; index++) {
        if (lines[index].time > time + previewSeconds) return null
        // Match findLyric: the last cue wins when timestamps are identical.
        while (index + 1 < lines.length && lines[index + 1].time === lines[index].time) index++
        if (lines[index].text) return lines[index]
    }

    return null
}
