import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import type { Task } from '../types/task';

interface DeleteConfirmModalProps {
  task: Task | null;
  onClose: () => void;
  onConfirm: (taskId: string) => Promise<void>;
}

export function DeleteConfirmModal({ task, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!task) return;
    setDeleting(false);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !deleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [task, deleting, onClose]);

  if (!task) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm(task.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div
        className="fixed inset-0 bg-[#1E1B2E]/35 backdrop-blur-[1px]"
        onClick={() => !deleting && onClose()}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-white border border-[#E6E0F4] rounded-2xl shadow-xl p-6 z-10"
      >
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 id="delete-modal-title" className="font-display text-lg font-bold text-[#1E1B2E]">
              Delete this task?
            </h2>
            <p className="mt-1.5 text-sm text-[#524B69] leading-relaxed">
              &ldquo;<span className="font-medium text-[#1E1B2E]">{task.title}</span>&rdquo; will
              be permanently removed from your workspace.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="h-10 px-4 rounded-xl border border-[#E6E0F4] bg-white hover:bg-[#F7F5FF] text-sm font-medium text-[#524B69] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="h-10 px-4 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-sm font-semibold transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {deleting && (
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{deleting ? 'Deleting...' : 'Delete Task'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
