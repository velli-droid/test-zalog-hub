import { useRef, useState } from 'react'
import type { SubmitEvent } from 'react'

import { useTaskStore } from '@/stores/task-store'

export function useTaskForm() {
    const [title, setTitle] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const addTask = useTaskStore((state) => state.addTask)

    function focusInput() {
        inputRef.current?.focus()
    }

    function submitTask(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!addTask(title)) return
        setTitle('')
        focusInput()
    }

    return { title, setTitle, inputRef, focusInput, submitTask, canSubmit: Boolean(title.trim()) }
}
