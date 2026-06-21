import { Assignee, Task, TaskPriority, TaskStatus } from './type';

/**
 * Realistic software-team assignees.
 */
export const mockAssignees: Assignee[] = [
  { id: 'u1', name: 'Talan Korsgaard' },
  { id: 'u2', name: 'Hanna Philips' },
  { id: 'u3', name: 'Davis Donin' },
  { id: 'u4', name: 'Maren Bothman' },
  { id: 'u5', name: 'Carter Vetrovs' },
];

/**
 * Helpers to keep mock dates deterministic-ish relative to "today".
 */
const today = new Date();
const iso = (offsetDays: number): string => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

/**
 * 12 realistic software backlog items.
 *  - All three statuses represented
 *  - All three priorities represented
 *  - 4 overdue tasks (past due date, status != Done)
 *  - 5 distinct assignees
 *  - 9 tasks carry tags
 */
export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Implement dark mode toggle',
    description:
      'Add a system-aware dark mode toggle in the settings panel. Persist preference in localStorage and respect prefers-color-scheme on first load.',
    status: TaskStatus.InProgress,
    priority: TaskPriority.High,
    dueDate: iso(2),
    assignee: mockAssignees[0],
    tags: ['frontend', 'ux'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: 't2',
    title: 'Fix payment webhook race condition',
    description:
      'Stripe webhook occasionally double-fires for refunds. Add idempotency keys and a Redis dedupe layer to guarantee single processing.',
    status: TaskStatus.Todo,
    priority: TaskPriority.High,
    dueDate: iso(-3),
    assignee: mockAssignees[2],
    tags: ['backend', 'payments', 'bug'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
  },
  {
    id: 't3',
    title: 'Migrate auth to short-lived JWTs',
    description:
      'Replace 30-day tokens with 15-min access + refresh token rotation. Update web and mobile clients in lock-step.',
    status: TaskStatus.Todo,
    priority: TaskPriority.High,
    dueDate: iso(7),
    assignee: mockAssignees[4],
    tags: ['security', 'backend'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: 't4',
    title: 'Design empty state illustrations',
    description:
      'Create on-brand illustrations for empty board columns, empty search, and onboarding. Deliver as optimized SVGs.',
    status: TaskStatus.InProgress,
    priority: TaskPriority.Medium,
    dueDate: iso(5),
    assignee: mockAssignees[1],
    tags: ['design'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 't5',
    title: 'Optimize Postgres query for /tasks list',
    description:
      'Current N+1 on assignees inflates p95 to 800ms. Add a join + index on (status, due_date) and benchmark with EXPLAIN ANALYZE.',
    status: TaskStatus.InProgress,
    priority: TaskPriority.Medium,
    dueDate: iso(-1),
    assignee: mockAssignees[2],
    tags: ['backend', 'performance'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: 't6',
    title: 'Write E2E tests for onboarding flow',
    description:
      'Cover signup, email verification, workspace creation and first invite. Use Playwright with CI matrix on Chromium and WebKit.',
    status: TaskStatus.Todo,
    priority: TaskPriority.Medium,
    dueDate: iso(10),
    assignee: mockAssignees[3],
    tags: ['testing', 'qa'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 't7',
    title: 'Update API documentation',
    description:
      'Regenerate OpenAPI spec from latest controllers and publish to docs.acme.dev. Include curl examples for every endpoint.',
    status: TaskStatus.Done,
    priority: TaskPriority.Low,
    dueDate: iso(-7),
    assignee: mockAssignees[1],
    tags: ['docs'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: 't8',
    title: 'Reduce Docker image size',
    description:
      'Switch base image to distroless and multi-stage build. Target < 80 MB compressed for the API image.',
    status: TaskStatus.Done,
    priority: TaskPriority.Low,
    dueDate: iso(-12),
    assignee: mockAssignees[4],
    tags: ['devops', 'performance'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
  {
    id: 't9',
    title: 'Add keyboard shortcuts for board navigation',
    description:
      'Implement j/k to navigate cards, c to create, e to edit, and ? to open a shortcuts cheatsheet modal.',
    status: TaskStatus.Todo,
    priority: TaskPriority.Low,
    dueDate: iso(14),
    assignee: mockAssignees[0],
    tags: ['frontend', 'a11y'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 't10',
    title: 'Audit dependencies for CVEs',
    description:
      'Run npm audit + Snyk on web and api, triage Critical/High, and open follow-up tickets for non-trivial upgrades.',
    status: TaskStatus.InProgress,
    priority: TaskPriority.High,
    dueDate: iso(-5),
    assignee: mockAssignees[3],
    tags: ['security'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
  },
  {
    id: 't11',
    title: 'Refactor billing service tests',
    description:
      'Tests are flaky due to shared fixtures. Move to factory-style builders and isolate the Stripe mock per test.',
    status: TaskStatus.Done,
    priority: TaskPriority.Medium,
    dueDate: iso(-4),
    assignee: mockAssignees[2],
    tags: ['testing', 'backend'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    id: 't12',
    title: 'Ship in-app changelog widget',
    description:
      'Lightweight popover that pulls last 5 entries from /api/changelog. Mark-as-read state per user.',
    status: TaskStatus.Todo,
    priority: TaskPriority.Medium,
    dueDate: iso(9),
    assignee: mockAssignees[1],
    tags: ['frontend', 'growth'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];

