
import { TaskManager } from '@/BLL/taskManager/TaskManager';
import { Task, TaskDraft, TaskPriority, TaskStatus, ValidationErrors } from '@/BLL/taskManager/type';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface TaskModalProps {
  manager: TaskManager;
  open: boolean;
  initialTask: Task | null;
  initialStatus: TaskStatus;
  onClose: () => void;
}

function todayIso(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function emptyDraft(status: TaskStatus, defaultAssigneeId: string): TaskDraft {
  return {
    title: '',
    description: '',
    status,
    priority: TaskPriority.Medium,
    dueDate: todayIso(),
    assigneeId: defaultAssigneeId,
    tags: [],
  };
}

export function TaskModal({ manager, open, initialTask, initialStatus, onClose }: TaskModalProps) {
  const assignees = manager.getAssignees();
  const isEditing = initialTask !== null;

  const buildDraft = useMemo<TaskDraft>(() => {
    if (initialTask) {
      return {
        title: initialTask.title,
        description: initialTask.description,
        status: initialTask.status,
        priority: initialTask.priority,
        dueDate: initialTask.dueDate,
        assigneeId: initialTask.assignee.id,
        tags: [...initialTask.tags],
      };
    }
    return emptyDraft(initialStatus, assignees[0]?.id ?? '');
  }, [initialTask, initialStatus, assignees]);

  const [draft, setDraft] = useState<TaskDraft>(buildDraft);
  const [tagInput, setTagInput] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);


  useEffect(() => {
  if (!open) return;
  if (initialTask) {
    setDraft(buildDraft);
  } else {
    setDraft(emptyDraft(initialStatus, manager.getAssignees()[0]?.id ?? ''));
  }
  setTagInput(''); setErrors({}); setSubmitAttempted(false);
}, [open, initialTask?.id, initialStatus]);


  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const update = <K extends keyof TaskDraft>(key: K, value: TaskDraft[K]): void => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (submitAttempted) {
      setErrors(manager.validateDraft({ ...draft, [key]: value }, { allowPastDueForExisting: isEditing }));
    }
  };

  const addTag = (): void => {
    const v = tagInput.trim();
    if (!v) return;
    if (draft.tags.includes(v)) {
      setTagInput('');
      return;
    }
    update('tags', [...draft.tags, v]);
    setTagInput('');
  };

  const removeTag = (t: string): void => {
    update(
      'tags',
      draft.tags.filter((x) => x !== t),
    );
  };

  const submit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSubmitAttempted(true);
    const errs = manager.validateDraft(draft, { allowPastDueForExisting: isEditing });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (initialTask) {
      manager.updateTask(initialTask.id, draft);
    } else {
      manager.createTask(draft);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4"
          onClick={onClose}
          data-testid="task-modal-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-pop"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            data-testid="task-modal"
          >
            <header className="flex items-center justify-between border-b border-surface-border px-5 py-4">
              <h2 className="text-base font-semibold text-ink-900">
                {isEditing ? 'Edit task' : 'New task'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                data-testid="modal-close-btn"
                className="rounded-md p-1 text-ink-500 hover:bg-surface-muted hover:text-ink-900"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </header>

            <form onSubmit={submit} className="space-y-4 px-5 py-5">
              <div>
                <label htmlFor="t-title" className="mb-1 block text-meta font-semibold text-ink-600">
                  Title
                </label>
                <input
                  id="t-title"
                  data-testid="modal-title-input"
                  type="text"
                  value={draft.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. Set up CI for the api repo"
                  className={[
                    'w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink-900 outline-none transition',
                    'focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
                    errors.title ? 'border-red-400' : 'border-surface-border',
                  ].join(' ')}
                />
                {errors.title && (
                  <p data-testid="error-title" className="mt-1 text-meta text-red-600">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="t-desc" className="mb-1 block text-meta font-semibold text-ink-600">
                  Description
                </label>
                <textarea
                  id="t-desc"
                  data-testid="modal-desc-input"
                  value={draft.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={3}
                  placeholder="What needs to happen?"
                  className="w-full resize-none rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="t-status" className="mb-1 block text-meta font-semibold text-ink-600">
                    Status
                  </label>
                  <select
                    id="t-status"
                    data-testid="modal-status-select"
                    value={draft.status}
                    onChange={(e) => update('status', e.target.value as TaskStatus)}
                    className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  >
                    <option value={TaskStatus.Todo}>To do</option>
                    <option value={TaskStatus.InProgress}>In progress</option>
                    <option value={TaskStatus.Done}>Done</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="t-priority"
                    className="mb-1 block text-meta font-semibold text-ink-600"
                  >
                    Priority
                  </label>
                  <select
                    id="t-priority"
                    data-testid="modal-priority-select"
                    value={draft.priority}
                    onChange={(e) => update('priority', e.target.value as TaskPriority)}
                    className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  >
                    <option value={TaskPriority.High}>High</option>
                    <option value={TaskPriority.Medium}>Medium</option>
                    <option value={TaskPriority.Low}>Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="t-due" className="mb-1 block text-meta font-semibold text-ink-600">
                    Due date
                  </label>
                  <input
                    id="t-due"
                    data-testid="modal-duedate-input"
                    type="date"
                    value={draft.dueDate}
                    onChange={(e) => update('dueDate', e.target.value)}
                    className={[
                      'w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink-900 outline-none transition',
                      'focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
                      errors.dueDate ? 'border-red-400' : 'border-surface-border',
                    ].join(' ')}
                  />
                  {errors.dueDate && (
                    <p data-testid="error-duedate" className="mt-1 text-meta text-red-600">
                      {errors.dueDate}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="t-assignee"
                    className="mb-1 block text-meta font-semibold text-ink-600"
                  >
                    Assignee
                  </label>
                  <select
                    id="t-assignee"
                    data-testid="modal-assignee-select"
                    value={draft.assigneeId}
                    onChange={(e) => update('assigneeId', e.target.value)}
                    className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  >
                    {assignees.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="t-tags" className="mb-1 block text-meta font-semibold text-ink-600">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    id="t-tags"
                    data-testid="modal-tag-input"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag and press Enter"
                    className="flex-1 rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                  <button
                    type="button"
                    data-testid="modal-add-tag-btn"
                    onClick={addTag}
                    className="rounded-lg border border-surface-border bg-white px-3 py-2 text-sm font-medium text-ink-800 transition hover:bg-surface-muted"
                  >
                    Add
                  </button>
                </div>
                {draft.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {draft.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-md bg-surface-muted px-2 py-0.5 text-badge text-ink-700 ring-1 ring-inset ring-surface-border"
                      >
                        {t}
                        <button
                          type="button"
                          data-testid={`modal-remove-tag-${t}`}
                          onClick={() => removeTag(t)}
                          className="text-ink-400 hover:text-red-600"
                          aria-label={`Remove ${t}`}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <footer className="flex items-center justify-end gap-2 border-t border-surface-border pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  data-testid="modal-cancel-btn"
                  className="rounded-lg border border-surface-border bg-white px-4 py-2 text-sm font-medium text-ink-800 transition hover:bg-surface-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-testid="modal-submit-btn"
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:bg-brand-800"
                >
                  {isEditing ? 'Save changes' : 'Create task'}
                </button>
              </footer>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

