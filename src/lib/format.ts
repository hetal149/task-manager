import { TaskPriority } from "@/BLL/taskManager/type";


/**
 * Compute initials from a person's name.
 */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Deterministic avatar background based on name — same name → same color.
 */
const AVATAR_PALETTE: string[] = [
  '#7916ff', // brand violet
  '#0ea5e9', // sky
  '#f59e0b', // amber
  '#ef4444', // red
  '#10b981', // emerald
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
];

export function avatarColorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx];
}

/**
 * Format an ISO date string as "DD MMM YYYY" (e.g. "02 Nov 2025").
 */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function formatDueDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = d.getDate().toString().padStart(2, '0');
  return `${day} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Tailwind classes for the priority badge.
 */
export function priorityBadgeClasses(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.High:
      return 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-100';
    case TaskPriority.Medium:
      return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100';
    case TaskPriority.Low:
      return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100';
  }
}

export function priorityLabel(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.High:
      return 'High';
    case TaskPriority.Medium:
      return 'Medium';
    case TaskPriority.Low:
      return 'Low';
  }
}

