import { useState } from 'react'

import { useKaraokeStore } from '@/stores/karaoke-store'
import { useTaskStore } from '@/stores/task-store'

type TaskFilter = 'all' | 'active' | 'completed'

export function useTasks() {
    const tasks = useTaskStore((state) => state.tasks)
    const storageError = useTaskStore((state) => state.storageError)
    const setCompleted = useTaskStore((state) => state.setCompleted)
    const removeTask = useTaskStore((state) => state.removeTask)
    const clearCompleted = useTaskStore((state) => state.clearCompleted)
    const [filter, setFilter] = useState<TaskFilter>('all')
    const activeLine = useKaraokeStore((state) => state.activeLine)
    const upcomingLine = useKaraokeStore((state) => state.upcomingLine)
    const upcomingKaraokeTask = upcomingLine
        ? { id: `karaoke-${upcomingLine.id}`, title: upcomingLine.text, completed: false }
        : null
    const karaokeTask = activeLine
        ? { id: `karaoke-${activeLine.id}`, title: activeLine.text, completed: false }
        : null
    const completed = tasks.filter((task) => task.completed).length
    const visible = tasks.filter(
        (task) => filter === 'all' || (filter === 'completed' ? task.completed : !task.completed),
    )
    const allDone = filter === 'active' && tasks.length > 0
    const emptyTitle =
        filter === 'completed'
            ? 'Всё ещё впереди'
            : allDone
              ? 'Все задачи выполнены!'
              : 'Здесь начинается порядок'
    const emptyDescription =
        filter === 'completed'
            ? 'Выполненные задачи появятся здесь.'
            : allDone
              ? 'Можно выдохнуть и насладиться результатом.'
              : 'Добавьте первую задачу — и первый шаг уже сделан.'

    function changeFilter(value: string) {
        if (value === 'all' || value === 'active' || value === 'completed') setFilter(value)
    }

    return {
        karaokeTask,
        upcomingKaraokeTask,
        tasks,
        completed,
        visible,
        storageError,
        filter,
        changeFilter,
        setCompleted,
        removeTask,
        clearCompleted,
        emptyTitle,
        emptyDescription,
    }
}
