import { AlertCircle, CheckCircle2, Plus, RefreshCw } from 'lucide-react';
import type { SidebarView, Task } from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  mutatingTaskId: string | null;
  activeView: SidebarView;
  hasActiveFilters: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
  onOpenAddModal: () => void;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function getEmptyCopy(view: SidebarView, hasFilters: boolean) {
  if (hasFilters) {
    return {
      title: 'No matching tasks',
      description: 'Try adjusting your search query or clearing your active category and priority filters.',
    };
  }
  switch (view) {
    case 'today':
      return {
        title: 'Nothing due today',
        description: 'You have no pending tasks scheduled for today. Add a task or plan ahead.',
      };
    case 'upcoming':
      return {
        title: 'No upcoming tasks',
        description: 'Tasks with future due dates will appear here automatically.',
      };
    case 'completed':
      return {
        title: 'No completed tasks yet',
        description: 'Completed tasks stay organized here once you check them off.',
      };
    default:
      return {
        title: 'Your task list is empty',
        description: 'Create your first task to organize personal, college, or work goals.',
      };
  }
}

export function TaskList({
  tasks,
  loading,
  error,
  mutatingTaskId,
  activeView,
  hasActiveFilters,
  onRetry,
  onClearFilters,
  onOpenAddModal,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (error) {
    return (
      <div
        role="alert"
        className="bg-white border border-red-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#1E1B2E]">Unable to load tasks</p>
            <p className="mt-0.5 text-sm text-[#524B69]">{error}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="h-10 px-4 rounded-xl border border-[#E6E0F4] bg-[#FAF9FE] hover:bg-[#F4F1FC] text-sm font-medium text-[#1E1B2E] inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="bg-white border border-[#E6E0F4] rounded-xl divide-y divide-[#EDE9F7] overflow-hidden"
        aria-label="Loading tasks"
      >
        {[1, 2, 3, 4].map((skeleton) => (
          <div key={skeleton} className="px-6 py-4 flex items-start gap-3.5 animate-pulse">
            <div className="mt-0.5 h-6 w-6 rounded-lg bg-[#F4F1FC] shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="h-4 w-1/2 max-w-[260px] rounded bg-[#F4F1FC]" />
              <div className="h-3.5 w-3/4 max-w-[420px] rounded bg-[#FAF9FE]" />
              <div className="h-3 w-48 rounded bg-[#F4F1FC]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    const empty = getEmptyCopy(activeView, hasActiveFilters);

    return (
      <div className="bg-white border border-[#E6E0F4] rounded-xl px-6 py-14 text-center">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-[#F4F1FC] text-[#6D28D9] flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-[#1E1B2E]">
          {empty.title}
        </h3>
        <p className="mt-1.5 text-sm text-[#524B69] max-w-md mx-auto">
          {empty.description}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="h-10 px-4 rounded-xl border border-[#E6E0F4] bg-white hover:bg-[#F7F5FF] text-sm font-medium text-[#1E1B2E] transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAddModal}
              className="h-10 px-4 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E6E0F4] rounded-xl overflow-hidden">
      <ul className="divide-y divide-[#EDE9F7]" aria-label="Task list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isBusy={mutatingTaskId === task.id}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}
