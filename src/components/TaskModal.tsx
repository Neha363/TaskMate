import { useEffect, useState, type FormEvent } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { motion } from 'motion/react';
import type { Task, TaskCategory, TaskInput, TaskPriority } from '../types/task';
import { getLocalTodayIso } from '../utils/taskUtils';

interface TaskModalProps {
  isOpen: boolean;
  editingTask: Task | null;
  onClose: () => void;
  onSave: (input: TaskInput, editingTaskId?: string) => Promise<void>;
}

const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High'];
const CATEGORIES: TaskCategory[] = ['Personal', 'College', 'Work'];

export function TaskModal({ isOpen, editingTask, onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [category, setCategory] = useState<TaskCategory>('Personal');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.due_date ?? '');
      setPriority(editingTask.priority);
      setCategory(editingTask.category);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(getLocalTodayIso());
      setPriority('Medium');
      setCategory('Personal');
    }
    setError(null);
    setSubmitting(false);
  }, [isOpen, editingTask]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please enter a task title.');
      return;
    }

    setSubmitting(true);
    try {
      await onSave(
        {
          title: title.trim(),
          description: description.trim(),
          due_date: dueDate ? dueDate : null,
          priority,
          category,
        },
        editingTask?.id
      );
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to save task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
    >
      <div
        className="fixed inset-0 bg-[#1E1B2E]/35 backdrop-blur-[1px]"
        onClick={() => !submitting && onClose()}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg bg-white border border-[#E6E0F4] rounded-2xl shadow-xl overflow-hidden z-10"
      >
        <div className="px-6 py-4 border-b border-[#EDE9F7] flex items-center justify-between">
          <h2 id="task-modal-title" className="font-display text-lg font-bold text-[#1E1B2E]">
            {editingTask ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close modal"
            className="h-9 w-9 rounded-xl flex items-center justify-center text-[#6B6385] hover:text-[#1E1B2E] hover:bg-[#F4F1FC] transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-800 flex items-start gap-2.5"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-[#1E1B2E] mb-1.5">
              Task Title <span className="text-[#DC2626]">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete database schema assignment"
              maxLength={140}
              className="w-full h-11 px-3.5 text-sm bg-white border border-[#E6E0F4] rounded-xl text-[#1E1B2E] placeholder:text-[#9F97B5] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/25 focus:border-[#6D28D9] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="block text-sm font-medium text-[#1E1B2E] mb-1.5"
            >
              Description
            </label>
            <textarea
              id="task-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add helpful notes, links, or subtasks..."
              maxLength={600}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E6E0F4] rounded-xl text-[#1E1B2E] placeholder:text-[#9F97B5] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/25 focus:border-[#6D28D9] transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-due-date"
                className="block text-sm font-medium text-[#1E1B2E] mb-1.5"
              >
                Due Date
              </label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-11 px-3.5 text-sm bg-white border border-[#E6E0F4] rounded-xl text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/25 focus:border-[#6D28D9] transition-colors"
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-[#1E1B2E] mb-1.5">
                Priority
              </span>
              <div
                className="grid grid-cols-3 gap-1 p-1 bg-[#F4F1FC] rounded-xl border border-[#E6E0F4]/80 h-11"
                role="group"
                aria-label="Select priority"
              >
                {PRIORITIES.map((option) => {
                  const selected = priority === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPriority(option)}
                      className={`text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        selected
                          ? 'bg-white text-[#5B21B6] shadow-xs'
                          : 'text-[#524B69] hover:text-[#1E1B2E]'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-[#1E1B2E] mb-1.5">
              Category
            </span>
            <div
              className="grid grid-cols-3 gap-1 p-1 bg-[#F4F1FC] rounded-xl border border-[#E6E0F4]/80 h-11"
              role="group"
              aria-label="Select category"
            >
              {CATEGORIES.map((option) => {
                const selected = category === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCategory(option)}
                    className={`text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                      selected
                        ? 'bg-white text-[#5B21B6] shadow-xs font-semibold'
                        : 'text-[#524B69] hover:text-[#1E1B2E]'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#EDE9F7]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-10 px-4 rounded-xl border border-[#E6E0F4] bg-white hover:bg-[#F7F5FF] text-sm font-medium text-[#524B69] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-10 px-5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {submitting && (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{editingTask ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
