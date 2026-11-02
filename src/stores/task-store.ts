import { create } from 'zustand'

export type Task = {
    id: string
    title: string
    completed: boolean
}

type TaskStore = {
    tasks: Task[]
    storageError: boolean
    addTask: (title: string) => boolean
    setCompleted: (id: string, completed: boolean) => void
    removeTask: (id: string) => void
    clearCompleted: () => void
}

const storageKey = 'quiet-tasks-v1'

function isTask(value: unknown): value is Task {
    return (
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        typeof value.id === 'string' &&
        'title' in value &&
        typeof value.title === 'string' &&
        'completed' in value &&
        typeof value.completed === 'boolean'
    )
}

function readTasks(): Pick<TaskStore, 'tasks' | 'storageError'> {
    try {
        const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
        return { tasks: Array.isArray(saved) ? saved.filter(isTask) : [], storageError: false }
    } catch {
        return { tasks: [], storageError: true }
    }
}

export const useTaskStore = create<TaskStore>((set, get) => {
    function updateTasks(update: (tasks: Task[]) => Task[]) {
        const tasks = update(get().tasks)
        let storageError = false

        try {
            localStorage.setItem(storageKey, JSON.stringify(tasks))
        } catch {
            storageError = true
        }

        set({ tasks, storageError })
    }

    return {
        ...readTasks(),
        addTask: (title) => {
            const trimmed = title.trim()
            if (!trimmed) return false

            updateTasks((tasks) => [
                ...tasks,
                { id: crypto.randomUUID(), title: trimmed.slice(0, 300), completed: false },
            ])
            return true
        },
        setCompleted: (id, completed) => {
            updateTasks((tasks) =>
                tasks.map((task) => (task.id === id ? { ...task, completed } : task)),
            )
        },
        removeTask: (id) => {
            updateTasks((tasks) => tasks.filter((task) => task.id !== id))
        },
        clearCompleted: () => {
            updateTasks((tasks) => tasks.filter((task) => !task.completed))
        },
    }
})
