import { useState } from 'react'
import { Check, ChevronDown, CircleCheck, Music2, Plus } from 'lucide-react'

import { KaraokePlayer } from '@/components/karaoke-player'
import { TaskList } from '@/components/task-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTaskForm } from '@/hooks/use-task-form'
import { useTasks } from '@/hooks/use-tasks'

import '@/App.css'

function App() {
    const [karaokeOpen, setKaraokeOpen] = useState(false)
    const {
        tasks,
        karaokeTask,
        upcomingKaraokeTask,
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
    } = useTasks()
    const { title, setTitle, inputRef, focusInput, submitTask, canSubmit } = useTaskForm()
    return (
        <div className="app-shell">
            <main>
                <div className="eyebrow">
                    <span /> СПИСОК ДЕЛ И КАРАОКЕ
                </div>
                <h1>Дела в своём ритме</h1>
                <p className="intro">Планируйте день, включайте караоке и подпевайте.</p>
                <section className="task-card" aria-label="Список задач">
                    <div className="card-heading">
                        <div>
                            <h2>
                                Мои задачи <span>{tasks.length}</span>
                            </h2>
                            <p>
                                {tasks.length - completed} в работе · {completed} выполнено
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            className="karaoke-toggle"
                            aria-expanded={karaokeOpen}
                            aria-controls="karaoke-panel"
                            onClick={() => setKaraokeOpen((open) => !open)}
                        >
                            <Music2 size={17} />
                            Караоке
                            <ChevronDown size={15} className={karaokeOpen ? 'is-open' : ''} />
                        </Button>
                    </div>

                    <div id="karaoke-panel" hidden={!karaokeOpen}>
                        <KaraokePlayer />
                    </div>
                    <form onSubmit={submitTask} className="add-form">
                        <Input
                            ref={inputRef}
                            aria-describedby="task-input-hint"
                            aria-label="Новая задача"
                            placeholder="Что нужно сделать?"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            maxLength={300}
                        />
                        <Button type="submit" disabled={!canSubmit}>
                            <Plus size={17} />
                            <span>Добавить</span>
                        </Button>
                    </form>
                    <div className="input-hint" id="task-input-hint">
                        <span>Enter — добавить задачу</span>
                        {title.length >= 240 && <span>{title.length} / 300</span>}
                    </div>
                    {tasks.length > 0 && (
                        <progress
                            className="task-progress"
                            aria-label="Прогресс выполнения задач"
                            value={completed}
                            max={tasks.length}
                        />
                    )}
                    <div className="list-toolbar">
                        <Tabs className="task-filters" value={filter} onValueChange={changeFilter}>
                            <TabsList aria-label="Фильтр задач">
                                <TabsTrigger value="all">Все</TabsTrigger>
                                <TabsTrigger value="active">Активные</TabsTrigger>
                                <TabsTrigger value="completed">Выполненные</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <span className="task-count">{tasks.length - completed} в работе</span>
                    </div>
                    <div className="task-content">
                        <TaskList
                            tasks={visible}
                            karaokeTask={karaokeTask}
                            upcomingKaraokeTask={upcomingKaraokeTask}
                            onSetCompleted={setCompleted}
                            onRemove={removeTask}
                        />
                        {!visible.length && !karaokeTask && !upcomingKaraokeTask && (
                            <div className="empty-state">
                                <div className="empty-illustration">
                                    <div className="paper">
                                        <span />
                                        <span />
                                        <span />
                                        <span className="paper-check">
                                            <Check size={15} strokeWidth={3} />
                                        </span>
                                    </div>
                                    <span className="spark spark-one" />
                                    <span className="spark spark-two" />
                                </div>
                                <h3>{emptyTitle}</h3>
                                <p>{emptyDescription}</p>
                                {filter === 'all' && (
                                    <button className="empty-action" onClick={focusInput}>
                                        <Plus size={15} /> Создать первую задачу
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="card-footer">
                        <span aria-live="polite">
                            <CircleCheck size={15} /> Выполнено {completed} из {tasks.length}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={!completed}
                            onClick={clearCompleted}
                        >
                            Очистить выполненные
                        </Button>
                    </div>
                </section>
                <p
                    className={storageError ? 'save-note storage-error' : 'save-note'}
                    role={storageError ? 'alert' : undefined}
                >
                    <span className="save-dot" />
                    {storageError
                        ? 'Не удалось сохранить задачи. Они доступны до закрытия страницы.'
                        : 'Задачи сохраняются в этом браузере автоматически'}
                </p>
            </main>
        </div>
    )
}
export default App
