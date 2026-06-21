
import { AnimatePresence } from 'framer-motion';
import { Inbox, Plus } from 'lucide-react';
import { useState } from 'react';
import { TaskCard } from './TaskCard';
import { TaskManager } from '@/BLL/taskManager/TaskManager';
import { Task, TaskStatus } from '@/BLL/taskManager/type';

interface KanbanColumnProps {
  manager: TaskManager;
  status: TaskStatus;
  title: string;
  accentDotClass: string;
  onCreate: (status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function KanbanColumn({
  manager,
  status,
  title,
  accentDotClass,
  onCreate,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const tasks = manager.getTasksByStatus(status);
  const [isOver, setIsOver] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isOver) setIsOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    const related = e.relatedTarget as Node | null;
    if (related && (e.currentTarget as Node).contains(related)) return;
    setIsOver(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsOver(false);
    const id = e.dataTransfer.getData('text/plain');
    if (id) manager.moveTo(id, status);
  };

  return (
    <section
      data-testid={`kanban-column-${status}`}
      className="flex h-full min-h-[60vh] w-full min-w-[300px] flex-col rounded-2xl bg-surface-muted/60 p-3"
    >
      <header className="mb-3 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className={['h-2 w-2 rounded-full', accentDotClass].join(' ')} />
          <h3 className="text-col-title uppercase tracking-wider text-ink-600">{title}</h3>
          <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-semibold text-ink-600 ring-1 ring-surface-border">
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          data-testid={`add-in-column-${status}`}
          onClick={() => onCreate(status)}
          className="rounded-md p-1 text-ink-400 transition hover:bg-white hover:text-brand-600"
          aria-label={`Add task to ${title}`}
        >
          <Plus size={16} />
        </button>
      </header>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          'scrollbar-thin flex-1 space-y-3 overflow-y-auto rounded-xl p-1 transition',
          isOver ? 'drop-target' : '',
        ].join(' ')}
      >
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              manager={manager}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && <EmptyState status={status} />}
      </div>
    </section>
  );
}

function EmptyState({ status }: { status: TaskStatus }) {
  const copy =
    status === TaskStatus.Todo
      ? 'Nothing to do yet. Drag a card here or create one.'
      : status === TaskStatus.InProgress
        ? 'No work in flight. Pull a card from Todo when you start.'
        : 'No tasks shipped yet. Move cards here when done.';
  return (
    <div
      data-testid={`empty-state-${status}`}
      className="mt-2 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-surface-border bg-white/60 p-6 text-center"
    >
      <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600">
        <Inbox size={18} />
      </div>
      <p className="text-card-body text-ink-500">{copy}</p>
    </div>
  );
}


