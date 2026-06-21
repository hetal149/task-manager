
import { AlertTriangle, ArrowDown, ArrowUp, CalendarDays, Pencil, Trash2 } from 'lucide-react';
import {
  avatarColorFor,
  formatDueDate,
  initialsOf,
  priorityBadgeClasses,
  priorityLabel,
} from '../../lib/format';
import { TaskManager } from '@/BLL/taskManager/TaskManager';
import { SortField, Task, TaskStatus } from '@/BLL/taskManager/type';

interface ListViewProps {
  manager: TaskManager;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const STATUS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.Todo]: 'To do',
  [TaskStatus.InProgress]: 'In progress',
  [TaskStatus.Done]: 'Done',
};

const STATUS_BADGE: Record<TaskStatus, string> = {
  [TaskStatus.Todo]: 'bg-amber-50 text-amber-700 ring-amber-100',
  [TaskStatus.InProgress]: 'bg-sky-50 text-sky-700 ring-sky-100',
  [TaskStatus.Done]: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
};

export function ListView({ manager, onEdit, onDelete }: ListViewProps) {
  const tasks = manager.getSortedTasks();
  const sort = manager.getSort();

  const toggleSort = (field: SortField): void => {
    if (sort.field === field) {
      manager.setSort({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      manager.setSort({ field, direction: 'asc' });
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) return <ArrowUp size={12} className="opacity-30" />;
    return sort.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  return (
    <div
      data-testid="list-view"
      className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-surface-border"
    >
      <div className="scrollbar-thin overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/60 text-col-title uppercase tracking-wider text-ink-600">
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">
                <button
                  type="button"
                  data-testid="sort-priority-btn"
                  onClick={() => toggleSort('priority')}
                  className="inline-flex items-center gap-1 hover:text-ink-900"
                >
                  Priority <SortIcon field="priority" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button
                  type="button"
                  data-testid="sort-duedate-btn"
                  onClick={() => toggleSort('dueDate')}
                  className="inline-flex items-center gap-1 hover:text-ink-900"
                >
                  Due date <SortIcon field="dueDate" />
                </button>
              </th>
              <th className="px-4 py-3">Assignee</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-card-body text-ink-500">
                  No tasks match the current filters.
                </td>
              </tr>
            )}
            {tasks.map((task) => {
              const overdue = manager.isOverdue(task);
              return (
                <tr
                  key={task.id}
                  data-testid={`list-row-${task.id}`}
                  className="border-b border-surface-border last:border-0 transition hover:bg-surface-muted/40"
                >
                  <td className="px-4 py-3 align-top">
                    <div className="text-card-title text-ink-900 line-clamp-1">{task.title}</div>
                    <div className="mt-0.5 text-card-body text-ink-500 line-clamp-1">
                      {task.description}
                    </div>
                    {task.tags.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-surface-muted px-1.5 py-0.5 text-badge text-ink-600 ring-1 ring-inset ring-surface-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={[
                        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge ring-1 ring-inset',
                        STATUS_BADGE[task.status],
                      ].join(' ')}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {STATUS_LABEL[task.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={[
                        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge',
                        priorityBadgeClasses(task.priority),
                      ].join(' ')}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {priorityLabel(task.priority)}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div
                      className={[
                        'inline-flex items-center gap-1.5 text-meta',
                        overdue ? 'font-semibold text-red-600' : 'text-ink-600',
                      ].join(' ')}
                    >
                      {overdue ? <AlertTriangle size={12} /> : <CalendarDays size={12} />}
                      {formatDueDate(task.dueDate)}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                        style={{ backgroundColor: avatarColorFor(task.assignee.name) }}
                        aria-label={task.assignee.name}
                      >
                        {initialsOf(task.assignee.name)}
                      </div>
                      <span className="text-meta text-ink-600">{task.assignee.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        data-testid={`list-edit-${task.id}`}
                        onClick={() => onEdit(task)}
                        className="rounded-md p-1.5 text-ink-500 transition hover:bg-surface-muted hover:text-brand-600"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        data-testid={`list-delete-${task.id}`}
                        onClick={() => onDelete(task)}
                        className="rounded-md p-1.5 text-ink-500 transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

