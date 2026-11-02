import { Check, CircleCheck, ListTodo, Plus } from 'lucide-react'

import { KaraokePlayer } from '@/components/karaoke-player'
import { TaskList } from '@/components/task-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTaskForm } from '@/hooks/use-task-form'
import { useTasks } from '@/hooks/use-tasks'

import '@/App.css'

function App() {
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
                <h1>
                    Все дела.
                    <br />
                    <span>И любимая песня.</span>
                </h1>
                <p className="intro">
                    Планируйте день, отмечайте сделанное и пойте в караоке.
                    <br className="desktop-break" /> Включите «Втюрилась» и подпевайте по строкам.
                </p>
                <section className="task-card" aria-label="Список задач">
                    <div className="card-heading">
                        <div>
                            <h2>
                                Мои задачи <span>{tasks.length}</span>
                            </h2>
                            <p>Добавьте планы на день или сделайте паузу на песню.</p>
                        </div>
                        <span className="heading-icon">
                            <ListTodo size={22} />
                        </span>
                    </div>

                    <KaraokePlayer />
                    <form onSubmit={submitTask} className="add-form">
                        <Input
                            ref={inputRef}
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
