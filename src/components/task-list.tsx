import { Music2, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useTaskMotion } from '@/hooks/use-task-motion'
import type { Task } from '@/stores/task-store'

type TaskListProps = {
    tasks: Task[]
    karaokeTask?: Task | null
    upcomingKaraokeTask?: Task | null
    onSetCompleted: (id: string, completed: boolean) => void
    onRemove: (id: string) => void
}

export function TaskList({
    tasks,
    karaokeTask,
    upcomingKaraokeTask,
    onSetCompleted,
    onRemove,
}: TaskListProps) {
    const animation = useTaskMotion()
    const rows = [
        ...(karaokeTask ? [karaokeTask] : []),
        ...(upcomingKaraokeTask ? [upcomingKaraokeTask] : []),
        ...tasks,
    ]

    return (
        <ul className="task-list">
            <AnimatePresence initial={false} mode="popLayout">
                {rows.map((task) => (
                    <motion.li
                        key={task.id}
                        {...animation}
                        className={
                            task.id === karaokeTask?.id
                                ? 'task-row karaoke-row'
                                : task.id === upcomingKaraokeTask?.id
                                  ? 'task-row karaoke-row is-upcoming'
                                  : task.completed
                                    ? 'task-row is-complete'
                                    : 'task-row'
                        }
                    >
                        {task.id === karaokeTask?.id || task.id === upcomingKaraokeTask?.id ? (
                            <>
                                <Music2 size={16} aria-hidden="true" />
                                <span
                                    className="task-lyric-title"
                                    aria-live={task.id === karaokeTask?.id ? 'polite' : 'off'}
                                >
                                    {task.title}
                                </span>
                                <span className="karaoke-badge">
                                    {task.id === upcomingKaraokeTask?.id ? 'Следующая' : 'Сейчас'}
                                </span>
                            </>
                        ) : (
                            <>
                                <Checkbox
                                    id={task.id}
                                    checked={task.completed}
                                    onCheckedChange={(checked) =>
                                        onSetCompleted(task.id, checked === true)
                                    }
                                />
                                <label htmlFor={task.id}>{task.title}</label>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label={`Удалить задачу: ${task.title}`}
                                    onClick={() => onRemove(task.id)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </>
                        )}
                    </motion.li>
                ))}
            </AnimatePresence>
        </ul>
    )
}
