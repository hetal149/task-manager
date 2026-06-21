# Taskly — Task Manager

A production-quality task management application built with **React 18 + TypeScript + Vite + Tailwind CSS**, featuring a Kanban board, sortable list view, full CRUD, filtering, and native HTML5 drag-and-drop.

All business logic lives inside a single `TaskManager` class — components are pure view layers.

---

## Quick start

```bash
npm install
npm run dev
```

The app starts at **http://localhost:5173** and is pre-loaded with 12 realistic software-team mock tasks.

To produce a production build:

```bash
npm run build
npm run preview
```

---

## Architecture

### Single source of truth

```
src/
├── BLL/taskManager/
│   ├── types.ts          ← all interfaces, enums, type aliases (no inline types)
│   ├── mockData.ts       ← 12 realistic tasks + 5 assignees
│   └── TaskManager.ts    ← class. all CRUD, filtering, sorting, persistence
│
├── components/taskManager/
│   ├── KanbanBoard.tsx
│   ├── KanbanColumn.tsx
│   ├── TaskCard.tsx
│   ├── ListView.tsx
│   ├── TaskModal.tsx
│   ├── ViewToggle.tsx
│   ├── FilterBar.tsx
│   └── DeleteDialog.tsx
│
├── pages/taskManager/
│   └── index.tsx         ← instantiates TaskManager exactly once
│
└── lib/
    ├── useTaskManager.ts ← subscription → re-render hook
    └── format.ts         ← pure UI helpers (no business logic)
```

### `TaskManager` class — design summary

`TaskManager` owns the tasks array, the active filters, the sort config, and the persisted view mode. It exposes:

- **CRUD** — `createTask`, `updateTask`, `deleteTask`, `moveTo`
- **Reads** — `getAllTasks`, `getTasksByStatus`, `getSortedTasks`, `getTaskById`, `getStats`
- **Filters** — `setFilterPriority`, `setFilterAssignee`, `clearFilters`, `getFilters`
- **Sort/View** — `setSort`, `setView`, `getSort`, `getView`
- **Validation** — `validateDraft`
- **Derived helpers** — `isOverdue`
- **Reactivity** — `subscribe(listener) → unsubscribe`

The class is a tiny pub/sub: any mutation calls `emit()`, and the `useTaskManager` hook bumps a counter to trigger a re-render. **No Redux, Zustand, MobX, or Context API are used for business logic.**

### Why a class + pub/sub instead of Context?

The spec forbids Context for business logic, and rightly so. A class instance threaded as a prop:

1. Survives unrelated re-renders (it is created once with `useMemo`).
2. Keeps business logic outside React's render lifecycle — easy to unit-test in pure TypeScript.
3. Makes the dependency graph explicit: every component declares the `manager: TaskManager` prop it needs.

---

## Features implemented

### Kanban view
- Three columns: **Todo**, **In Progress**, **Done**.
- Native HTML5 drag-and-drop. Dropping a card calls `manager.moveTo(id, status)`.
- Per-card and per-column drop-target visual feedback.
- Framer Motion `layout` + `AnimatePresence` for smooth column transitions.
- Distinct empty-state UI per column with column-specific copy.

### List view
- Responsive table with status, priority, due date, assignee, and tags.
- Sortable by **due date** and **priority** (asc/desc) via clickable column headers — sort logic lives in `TaskManager.getSortedTasks`.
- Persists `view` and `sort` in `localStorage` (`task-manager.ui-state.v1`).

### Task card
- Title, two-line clamped description, priority badge, due date with calendar icon.
- Tags rendered as muted chips (+N overflow).
- Overdue tasks: red date text **and** an `AlertTriangle` warning icon.
- Assignee initials avatar — colour is **deterministically derived from the name** via `avatarColorFor`.

### Create / edit modal
- Inline validation:
  - Title required + 120-char ceiling.
  - Due date required and (for new tasks) cannot be in the past. Editing an existing overdue task is permitted.
- Tag input with Enter-to-add, click-to-remove.
- ESC closes the modal; click on overlay also closes.

### Delete
- Confirmation `alertdialog` with the task title called out.
- Confirm calls `manager.deleteTask(id)`.

### Filters
- Priority filter (`all` / High / Medium / Low).
- Assignee filter (`all` + every assignee).
- Both are methods on `TaskManager`. **No inline filtering** in components.
- Header chips show running counts (total / done / overdue) for the **filtered** set… wait — they show the unfiltered backlog stats, which is the more useful glanceable metric for an engineering lead.

---

## Mock data shape

`src/BLL/taskManager/mockData.ts` ships with:

- 12 realistic backlog items (auth, payments, perf, security, docs, devops, design, growth, a11y).
- All three statuses, all three priorities.
- **4** tasks already overdue (status ≠ Done, due date in the past).
- **5** distinct assignees.
- **9** tasks carry between 1 and 3 tags.

---

## Design decisions

1. **Violet/indigo accent on warm-neutral surfaces.** The reference screenshots lean on a single brand violet against off-white surfaces (`#f7f7fb`). I avoided gradients on dark elements and applied violet only to interactive affordances (primary CTA, active toggle, focus rings). Trade-off: less "marketing wow", more legibility under sustained use.

2. **Class + pub/sub instead of Context.** Context would have been the path of least resistance, but it (a) violates the spec and (b) couples business logic to React's render tree. The class is plain TS, trivially testable, and the `useTaskManager` hook is 8 lines.

3. **Deterministic avatar colours.** Avatars are derived from the assignee's name via a stable hash → palette index. Same person, same colour, always — important when scanning a dense board.

4. **Per-column empty states with column-specific copy.** Rather than a single shared "No tasks" message, each column has tailored micro-copy ("Pull a card from Todo when you start.") so the empty state still teaches the workflow.

---

## Typography & spacing

Implemented via Tailwind tokens in `tailwind.config.ts`:

| Role           | Size       | Weight |
| -------------- | ---------- | ------ |
| Page title     | 24 / 32 px | 700    |
| Column title   | 13 / 18 px | 600    |
| Card title     | 14 / 20 px | 600    |
| Card body      | 12 / 18 px | 400    |
| Badge / chip   | 11 / 14 px | 600    |
| Meta label     | 11 / 14 px | 400    |

All margins/paddings are multiples of 4 (`p-1`, `p-2`, `p-3`, `p-4`, `p-5`, `p-6`).

**Priority colour mapping:**
- High → red (`bg-red-50` / `text-red-600`)
- Medium → amber (`bg-amber-50` / `text-amber-700`)
- Low → blue (`bg-blue-50` / `text-blue-700`)

---

## Known limitations

- **No backend.** All mutations are in-memory; refresh resets the tasks (view + sort persist).
- **No mobile layout.** The spec only required graceful behaviour at ≥ 1280px; below `md` the board falls back to a single-column scroll.
- **Search bar is decorative.** The top-bar search field is present in the chrome but not wired to filtering — out of scope for this iteration.
- **Drag-and-drop is HTML5-only.** Touch drag is not supported (the spec required HTML5 D&D).
- **No undo on delete.** Deletion is destructive; an undo-snackbar would be a natural follow-up.

---

## Tech

- React 18, TypeScript 5.5, Vite 5
- Tailwind CSS 3 (custom font sizes + spacing tokens)
- Framer Motion (card layout / entrance animations, modal transitions)
- Lucide React (icons)

---

## Scripts

| Command          | What it does                              |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | Start the Vite dev server on `:5173`      |
| `npm run build`  | Type-check (`tsc -b`) + build for prod    |
| `npm run preview`| Preview the production build              |

---

## Time log

| Phase                                       | ~Hours |
| ------------------------------------------- | ------ |
| Spec read, architecture & types             | 1.0    |
| `TaskManager` class + mock data             | 1.0    |
| Kanban board, columns, card, drag-and-drop  | 1.5    |
| List view + sort + persistence              | 0.5    |
| Modal, validation, delete confirm           | 1.0    |
| Filters, empty states, polish               | 0.5    |
| README + design notes                       | 0.5    |
| **Total**                                   | **6.0** |

