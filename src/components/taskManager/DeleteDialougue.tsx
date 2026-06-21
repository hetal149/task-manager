
import { Task } from '@/BLL/taskManager/type';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

interface DeleteDialogProps {
  task: Task | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteDialog({ task, onConfirm, onCancel }: DeleteDialogProps) {
  useEffect(() => {
    if (!task) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [task, onCancel]);

  return (
    <AnimatePresence>
      {task && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4"
          onClick={onCancel}
          data-testid="delete-dialog-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-pop"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            data-testid="delete-dialog"
          >
            <div className="flex items-start gap-3 px-5 py-5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink-900">Delete this task?</h3>
                <p className="mt-1 text-sm text-ink-500">
                  <span className="font-medium text-ink-800">{task.title}</span> will be permanently
                  removed. This action can&apos;t be undone.
                </p>
              </div>
            </div>
            <footer className="flex items-center justify-end gap-2 border-t border-surface-border bg-surface-muted/40 px-5 py-3">
              <button
                type="button"
                onClick={onCancel}
                data-testid="delete-cancel-btn"
                className="rounded-lg border border-surface-border bg-white px-3.5 py-2 text-sm font-medium text-ink-800 transition hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                data-testid="delete-confirm-btn"
                className="rounded-lg bg-red-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:bg-red-800"
              >
                Delete task
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

