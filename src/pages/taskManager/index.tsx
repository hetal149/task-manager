import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Hexagon,
  Plus,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import { TaskManager } from '@/BLL/taskManager/TaskManager';
import { useTaskManager } from '@/lib/useTaskManager';
import { Task, TaskStatus } from '@/BLL/taskManager/type';
import { ViewToggle } from '@/components/taskManager/ViewToggle';
import { FilterBar } from '@/components/taskManager/FilterBar';
import { KanbanBoard } from '@/components/taskManager/KanbanBoard';
import { ListView } from '@/components/taskManager/ListView';
import { TaskModal } from '@/components/taskManager/TaskModal';
import { DeleteDialog } from '@/components/taskManager/DeleteDialougue';

export default function TaskManagerPage() {
  const manager = useMemo<TaskManager>(() => new TaskManager(), []);
  useTaskManager(manager);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [initialStatus, setInitialStatus] = useState<TaskStatus>(TaskStatus.Todo);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const view = manager.getView();
  const stats = manager.getStats();

  const openCreate = (status: TaskStatus): void => {
    setEditingTask(null);
    setInitialStatus(status);
    setModalOpen(true);
  };

  const openEdit = (task: Task): void => {
    setEditingTask(task);
    setInitialStatus(task.status);
    setModalOpen(true);
  };

  const requestDelete = (task: Task): void => {
    setDeleteTarget(task);
  };

  const confirmDelete = (): void => {
    if (deleteTarget) {
      manager.deleteTask(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted">
    
      <header className="border-b border-surface-border bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
              <Hexagon size={16} strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold tracking-tight text-ink-900">Taskly</span>
            <span className="hidden text-meta text-ink-400 sm:inline">·</span>
            <span className="hidden text-meta text-ink-500 sm:inline">Team workspace</span>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-6 py-6">
        <section className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-page-title text-ink-900">Tasks</h1>
            <p className="mt-1 text-sm text-ink-500">
              Plan, track and ship engineering work for the team.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-meta text-ink-600">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 ring-1 ring-surface-border">
                <Sparkles size={12} className="text-brand-600" />
                {stats.total} total
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 ring-1 ring-surface-border">
                <CheckCircle2 size={12} className="text-emerald-600" />
                {stats.done} done
              </span>
              <span
                className={[
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1',
                  stats.overdue > 0
                    ? 'bg-red-50 ring-red-100 text-red-700'
                    : 'bg-white ring-surface-border',
                ].join(' ')}
              >
                <TriangleAlert size={12} className={stats.overdue > 0 ? 'text-red-600' : 'text-ink-400'} />
                {stats.overdue} overdue
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ViewToggle view={view} onChange={(v) => manager.setView(v)} />
            <button
              type="button"
              data-testid="new-task-btn"
              onClick={() => openCreate(TaskStatus.Todo)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:bg-brand-800"
            >
              <Plus size={14} /> New task
            </button>
          </div>
        </section>

        <section className="mb-5 rounded-2xl bg-white p-3 shadow-card ring-1 ring-surface-border">
          <FilterBar manager={manager} />
        </section>

        {view === 'kanban' ? (
          <KanbanBoard
            manager={manager}
            onCreate={openCreate}
            onEdit={openEdit}
            onDelete={requestDelete}
          />
        ) : (
          <ListView manager={manager} onEdit={openEdit} onDelete={requestDelete} />
        )}
      </main>

      <TaskModal
        manager={manager}
        open={modalOpen}
        initialTask={editingTask}
        initialStatus={initialStatus}
        onClose={() => setModalOpen(false)}
      />

      <DeleteDialog
        task={deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

