
import { TaskManager } from '@/BLL/taskManager/TaskManager';
import { Filters, TaskPriority } from '@/BLL/taskManager/type';
import { Filter, X } from 'lucide-react';

interface FilterBarProps {
  manager: TaskManager;
}

export function FilterBar({ manager }: FilterBarProps) {
  const filters: Filters = manager.getFilters();
  const assignees = manager.getAssignees();
  const active =
    filters.priority !== 'all' || filters.assigneeId !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-meta font-semibold uppercase tracking-wider text-ink-500">
        <Filter size={12} /> Filters
      </span>

      <select
        data-testid="filter-priority"
        value={filters.priority}
        onChange={(e) =>
          manager.setFilterPriority(e.target.value as TaskPriority | 'all')
        }
        className="rounded-lg border border-surface-border bg-white px-2.5 py-1.5 text-sm text-ink-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      >
        <option value="all">All priorities</option>
        <option value={TaskPriority.High}>High</option>
        <option value={TaskPriority.Medium}>Medium</option>
        <option value={TaskPriority.Low}>Low</option>
      </select>

      <select
        data-testid="filter-assignee"
        value={filters.assigneeId}
        onChange={(e) => manager.setFilterAssignee(e.target.value)}
        className="rounded-lg border border-surface-border bg-white px-2.5 py-1.5 text-sm text-ink-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      >
        <option value="all">All assignees</option>
        {assignees.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>

      {active && (
        <button
          type="button"
          data-testid="filter-clear"
          onClick={() => manager.clearFilters()}
          className="inline-flex items-center gap-1 rounded-lg border border-surface-border bg-white px-2.5 py-1.5 text-sm text-ink-600 transition hover:bg-surface-muted hover:text-ink-900"
        >
          <X size={12} /> Clear
        </button>
      )}
    </div>
  );
}


