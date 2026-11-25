import { Calendar, Check, Flag, Folder, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { Task, TaskPriority } from '../types/task';
import { formatDueDate, isOverdue } from '../utils/taskUtils';

interface TaskItemProps {
  task: Task;
  isBusy: boolean;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const PRIORITY_STYLE: Record<TaskPriority, { text: string; label: string }> = {
  High: { text: 'text-[#DC2626]', label: 'High priority' },
  Medium: { text: 'text-[#D97706]', label: 'Medium priority' },
  Low: { text: 'text-[#059669]', label: 'Low priority' },
};

export function TaskItem({
  task,
  isBusy,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const overdue = isOverdue(task);
  const priorityInfo = PRIORITY_STYLE[task.priority];

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className={`group px-4 sm:px-6 py-4 flex items-start justify-between gap-4 transition-colors hover:bg-[#FAF9FE] ${
        task.is_completed ? 'bg-[#FCFBFF]' : 'bg-white'
      }`}
    >
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        {/* Completion Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(task)}
          disabled={isBusy}
          aria-label={
            task.is_completed
              ? `Mark "${task.title}" as pending`
              : `Mark "${task.title}" as complete`
          }
          aria-pressed={task.is_completed}
          className={`mt-0.5 h-6 w-6 rounded-lg border flex items-center justify-center shrink-0 transition-all cursor-pointer disabled:opacity-50 ${
            task.is_completed
              ? 'bg-[#6D28D9] border-[#6D28D9] text-white'
              : 'bg-white border-[#CFC5EB] hover:border-[#6D28D9] text-transparent'
          }`}
        >
          <Check className="h-3.5 w-3.5 stroke-[2.6]" />
        </button>

        {/* Task Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`text-sm sm:text-[15px] font-semibold leading-snug break-words ${
                task.is_completed
                  ? 'line-through text-[#8D85A5]'
                  : 'text-[#1E1B2E]'
              }`}
            >
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p
              className={`mt-1 text-sm leading-relaxed break-words ${
                task.is_completed ? 'text-[#A39BB9]' : 'text-[#524B69]'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Unboxed Metadata Line */}
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#6B6385]">
            <span className={`inline-flex items-center gap-1 font-medium ${priorityInfo.text}`}>
              <Flag className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{priorityInfo.label}</span>
            </span>

            <span aria-hidden="true" className="text-[#CFC5EB]">
              ·
            </span>

            <span className="inline-flex items-center gap-1">
              <Folder className="h-3 w-3 shrink-0 text-[#8D85A5]" aria-hidden="true" />
              <span>{task.category}</span>
            </span>

            <span aria-hidden="true" className="text-[#CFC5EB]">
              ·
            </span>

            <span
              className={`inline-flex items-center gap-1 tabular-nums ${
                overdue ? 'text-[#DC2626] font-medium' : ''
              }`}
            >
              <Calendar
                className={`h-3 w-3 shrink-0 ${overdue ? 'text-[#DC2626]' : 'text-[#8D85A5]'}`}
                aria-hidden="true"
              />
              <span>
                {overdue ? `Overdue (${formatDueDate(task.due_date)})` : formatDueDate(task.due_date)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(task)}
          disabled={isBusy}
          aria-label={`Edit "${task.title}"`}
          title="Edit task"
          className="h-10 w-10 rounded-xl flex items-center justify-center text-[#6B6385] hover:text-[#5B21B6] hover:bg-[#EDE9FE]/70 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          disabled={isBusy}
          aria-label={`Delete "${task.title}"`}
          title="Delete task"
          className="h-10 w-10 rounded-xl flex items-center justify-center text-[#6B6385] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.li>
  );
}
