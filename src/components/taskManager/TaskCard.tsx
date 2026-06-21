
import { motion } from 'framer-motion';
import { AlertTriangle, CalendarDays, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  avatarColorFor,
  formatDueDate,
  initialsOf,
  priorityBadgeClasses,
  priorityLabel,
} from '../../lib/format';
import { useState } from 'react';
import { Task } from '@/BLL/taskManager/type';
import { TaskManager } from '@/BLL/taskManager/TaskManager';

interface TaskCardProps {
  task: Task;
  manager: TaskManager;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, manager, onEdit, onDelete }: TaskCardProps) {
  const overdue = manager.isOverdue(task);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setDragging(true);
  };

  const handleDragEnd = (): void => {
    setDragging(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      data-testid={`task-card-${task.id}`}
    >
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={[
        'group relative cursor-grab active:cursor-grabbing rounded-xl bg-white p-4 shadow-card ring-1 ring-surface-border transition',
        'hover:shadow-card-hover hover:ring-brand-200',
        dragging ? 'dragging' : '',
      ].join(' ')}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          data-testid={`priority-badge-${task.id}`}
          className={[
            'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge',
            priorityBadgeClasses(task.priority),
          ].join(' ')}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {priorityLabel(task.priority)}
        </span>

        <div className="relative">
          <button
            type="button"
            data-testid={`card-menu-btn-${task.id}`}
            onClick={() => setMenuOpen((v) => !v)}
            onBlur={() => window.setTimeout(() => setMenuOpen(false), 120)}
            className="rounded-md p-1 text-ink-400 opacity-0 transition hover:bg-surface-muted hover:text-ink-600 group-hover:opacity-100"
            aria-label="Open card menu"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-7 z-20 w-36 overflow-hidden rounded-lg bg-white p-1 shadow-pop ring-1 ring-surface-border animate-fade-in"
              role="menu"
            >
              <button
                type="button"
                data-testid={`card-edit-btn-${task.id}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  onEdit(task);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-ink-800 hover:bg-surface-muted"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                type="button"
                data-testid={`card-delete-btn-${task.id}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  onDelete(task);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h4 className="text-card-title text-ink-900 line-clamp-1">{task.title}</h4>

      <p className="mt-1 text-card-body text-ink-500 line-clamp-2">{task.description}</p>

      {task.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-surface-muted px-2 py-0.5 text-badge text-ink-600 ring-1 ring-inset ring-surface-border"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="rounded-md px-2 py-0.5 text-badge text-ink-500">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-3">
        <div
          className={[
            'flex items-center gap-1.5 text-meta',
            overdue ? 'text-red-600 font-semibold' : 'text-ink-500',
          ].join(' ')}
          data-testid={`due-date-${task.id}`}
        >
          {overdue ? (
            <AlertTriangle size={12} className="shrink-0" />
          ) : (
            <CalendarDays size={12} className="shrink-0" />
          )}
          <span>{formatDueDate(task.dueDate)}</span>
        </div>

        <div
          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white shadow-sm"
          style={{ backgroundColor: avatarColorFor(task.assignee.name) }}
          title={task.assignee.name}
          aria-label={task.assignee.name}
          data-testid={`assignee-avatar-${task.id}`}
        >
          {initialsOf(task.assignee.name)}
        </div>
      </div>
    </div>
    </motion.div>
  );
}

