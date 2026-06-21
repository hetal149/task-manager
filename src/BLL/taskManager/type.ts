/**
 * Task Manager — Types
 * All interfaces, enums and type aliases live here.
 * No inline types are allowed anywhere else in the codebase.
 */

export enum TaskStatus {
  Todo = 'todo',
  InProgress = 'in_progress',
  Done = 'done',
}

export enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export type SortField = 'dueDate' | 'priority';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'kanban' | 'list';

export interface Assignee {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO date (YYYY-MM-DD)
  assignee: Assignee;
  tags: string[];
  createdAt: string; // ISO datetime
}

export interface TaskDraft {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigneeId: string;
  tags: string[];
}

export interface ValidationErrors {
  title?: string;
  dueDate?: string;
}

export interface Filters {
  priority: TaskPriority | 'all';
  assigneeId: string | 'all';
}

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface PersistedUiState {
  view: ViewMode;
  sort: SortConfig;
}

export type Listener = () => void;


