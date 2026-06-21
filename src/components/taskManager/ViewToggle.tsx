
import { ViewMode } from '@/BLL/taskManager/type';
import { Columns3, List } from 'lucide-react';

interface ViewToggleProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div
      data-testid="view-toggle"
      className="inline-flex items-center gap-1 rounded-lg bg-white p-1 ring-1 ring-surface-border"
    >
      <button
        type="button"
        data-testid="view-toggle-kanban"
        onClick={() => onChange('kanban')}
        className={[
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition',
          view === 'kanban'
            ? 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100'
            : 'text-ink-600 hover:bg-surface-muted',
        ].join(' ')}
      >
        <Columns3 size={14} />
        Board
      </button>
      <button
        type="button"
        data-testid="view-toggle-list"
        onClick={() => onChange('list')}
        className={[
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition',
          view === 'list'
            ? 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100'
            : 'text-ink-600 hover:bg-surface-muted',
        ].join(' ')}
      >
        <List size={14} />
        List
      </button>
    </div>
  );
}


