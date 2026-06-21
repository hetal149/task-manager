import { mockAssignees, mockTasks } from './mockData';
import {
  Assignee,
  Filters,
  Listener,
  PersistedUiState,
  SortConfig,
  Task,
  TaskDraft,
  TaskPriority,
  TaskStatus,
  ValidationErrors,
  ViewMode,
} from './type';

const STORAGE_KEY = 'task-manager.ui-state.v1';

const PRIORITY_RANK: Record<TaskPriority, number> = {
  [TaskPriority.High]: 3,
  [TaskPriority.Medium]: 2,
  [TaskPriority.Low]: 1,
};

/**
 * TaskManager — single source of truth for all task business logic.
 *
 * Architectural rules enforced by this file:
 *   • All CRUD, sorting, filtering and persistence lives in this class.
 *   • Components must never mutate tasks directly; they call methods here.
 *   • Subscribers receive a notification on every state change.
 *   • Loads mock data on construction.
 */
export class TaskManager {
  private tasks: Task[];
  private assignees: Assignee[];
  private filters: Filters;
  private sort: SortConfig;
  private view: ViewMode;
  private listeners: Set<Listener>;

  constructor() {
    this.tasks = [...mockTasks];
    this.assignees = [...mockAssignees];
    this.filters = { priority: 'all', assigneeId: 'all' };
    this.sort = { field: 'dueDate', direction: 'asc' };
    this.view = 'kanban';
    this.listeners = new Set();

    this.hydrateFromStorage();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Subscription
  // ──────────────────────────────────────────────────────────────────────────
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    this.listeners.forEach((l) => l());
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Persistence
  // ──────────────────────────────────────────────────────────────────────────
  private hydrateFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<PersistedUiState>;
      if (parsed.view === 'kanban' || parsed.view === 'list') {
        this.view = parsed.view;
      }
      if (parsed.sort && (parsed.sort.field === 'dueDate' || parsed.sort.field === 'priority')) {
        this.sort = {
          field: parsed.sort.field,
          direction: parsed.sort.direction === 'desc' ? 'desc' : 'asc',
        };
      }
    } catch {
      /* ignore corrupted storage */
    }
  }

  private persist(): void {
    if (typeof window === 'undefined') return;
    const payload: PersistedUiState = { view: this.view, sort: this.sort };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* quota — ignore */
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Reads
  // ──────────────────────────────────────────────────────────────────────────
  getAllTasks(): Task[] {
    return this.applyFilters(this.tasks);
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.applyFilters(this.tasks.filter((t) => t.status === status));
  }

  getSortedTasks(): Task[] {
    return this.sortTasks(this.getAllTasks(), this.sort);
  }

  getAssignees(): Assignee[] {
    return [...this.assignees];
  }

  getFilters(): Filters {
    return { ...this.filters };
  }

  getSort(): SortConfig {
    return { ...this.sort };
  }

  getView(): ViewMode {
    return this.view;
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  getStats(): { total: number; overdue: number; done: number } {
    const overdue = this.tasks.filter((t) => this.isOverdue(t)).length;
    const done = this.tasks.filter((t) => t.status === TaskStatus.Done).length;
    return { total: this.tasks.length, overdue, done };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CRUD
  // ──────────────────────────────────────────────────────────────────────────
  createTask(draft: TaskDraft): Task {
    const assignee = this.assignees.find((a) => a.id === draft.assigneeId) ?? this.assignees[0];
    const task: Task = {
      id: this.generateId(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      status: draft.status,
      priority: draft.priority,
      dueDate: draft.dueDate,
      assignee,
      tags: draft.tags.map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    this.tasks = [task, ...this.tasks];
    this.emit();
    return task;
  }

  updateTask(id: string, draft: TaskDraft): Task | undefined {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return undefined;
    const assignee = this.assignees.find((a) => a.id === draft.assigneeId) ?? this.tasks[idx].assignee;
    const updated: Task = {
      ...this.tasks[idx],
      title: draft.title.trim(),
      description: draft.description.trim(),
      status: draft.status,
      priority: draft.priority,
      dueDate: draft.dueDate,
      assignee,
      tags: draft.tags.map((t) => t.trim()).filter(Boolean),
    };
    this.tasks = [...this.tasks.slice(0, idx), updated, ...this.tasks.slice(idx + 1)];
    this.emit();
    return updated;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.emit();
  }

  moveTo(id: string, status: TaskStatus): void {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1 || this.tasks[idx].status === status) return;
    const moved: Task = { ...this.tasks[idx], status };
    this.tasks = [...this.tasks.slice(0, idx), moved, ...this.tasks.slice(idx + 1)];
    this.emit();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Filtering & sorting (lives here — never in components)
  // ──────────────────────────────────────────────────────────────────────────
  setFilterPriority(priority: TaskPriority | 'all'): void {
    this.filters = { ...this.filters, priority };
    this.emit();
  }

  setFilterAssignee(assigneeId: string | 'all'): void {
    this.filters = { ...this.filters, assigneeId };
    this.emit();
  }

  clearFilters(): void {
    this.filters = { priority: 'all', assigneeId: 'all' };
    this.emit();
  }

  setSort(sort: SortConfig): void {
    this.sort = { ...sort };
    this.persist();
    this.emit();
  }

  setView(view: ViewMode): void {
    this.view = view;
    this.persist();
    this.emit();
  }

  private applyFilters(input: Task[]): Task[] {
    const { priority, assigneeId } = this.filters;
    return input.filter((t) => {
      if (priority !== 'all' && t.priority !== priority) return false;
      if (assigneeId !== 'all' && t.assignee.id !== assigneeId) return false;
      return true;
    });
  }

  private sortTasks(input: Task[], sort: SortConfig): Task[] {
    const dir = sort.direction === 'asc' ? 1 : -1;
    const out = [...input];
    out.sort((a, b) => {
      if (sort.field === 'dueDate') {
        return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * dir;
      }
      return (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]) * dir;
    });
    return out;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Validation
  // ──────────────────────────────────────────────────────────────────────────
  validateDraft(draft: TaskDraft, opts?: { allowPastDueForExisting?: boolean }): ValidationErrors {
    const errors: ValidationErrors = {};
    if (!draft.title.trim()) {
      errors.title = 'Title is required.';
    } else if (draft.title.trim().length > 120) {
      errors.title = 'Title must be 120 characters or fewer.';
    }

    if (!draft.dueDate) {
      errors.dueDate = 'Due date is required.';
    } else if (!opts?.allowPastDueForExisting) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(draft.dueDate);
      if (Number.isNaN(due.getTime())) {
        errors.dueDate = 'Due date is invalid.';
      } else if (due.getTime() < today.getTime()) {
        errors.dueDate = 'Due date cannot be in the past.';
      }
    }
    return errors;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Derived helpers
  // ──────────────────────────────────────────────────────────────────────────
  isOverdue(task: Task): boolean {
    if (task.status === TaskStatus.Done) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    return due.getTime() < today.getTime();
  }

  private generateId(): string {
    return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }
}

