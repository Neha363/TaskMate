import { ArrowRight } from 'lucide-react';
import type { SidebarView, Task, TaskCategory, TaskPriority, TaskStats } from '../types/task';
import { StatsGrid } from './StatsGrid';
import { TaskList } from './TaskList';

interface DashboardOverviewProps {
  tasks: Task[];
  filteredFocusTasks: Task[];
  stats: TaskStats;
  loading: boolean;
  error: string | null;
  mutatingTaskId: string | null;
  searchQuery: string;
  onNavigateView: (view: SidebarView) => void;
  onSelectCategoryView: (category: TaskCategory) => void;
  onRetry: () => void;
  onClearSearch: () => void;
  onOpenAddModal: () => void;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const CATEGORIES: TaskCategory[] = ['Personal', 'College', 'Work'];
const PRIORITIES: Array<{ key: TaskPriority; color: string }> = [
  { key: 'High', color: 'bg-[#DC2626]' },
  { key: 'Medium', color: 'bg-[#D97706]' },
  { key: 'Low', color: 'bg-[#059669]' },
];

export function DashboardOverview({
  tasks,
  filteredFocusTasks,
  stats,
  loading,
  error,
  mutatingTaskId,
  searchQuery,
  onNavigateView,
  onSelectCategoryView,
  onRetry,
  onClearSearch,
  onOpenAddModal,
  onToggleComplete,
  onEdit,
  onDelete,
}: DashboardOverviewProps) {
  const pendingTasks = tasks.filter((t) => !t.is_completed);
  const totalPending = pendingTasks.length;

  const getCategoryStats = (category: TaskCategory) => {
    const items = tasks.filter((t) => t.category === category);
    const completed = items.filter((t) => t.is_completed).length;
    return { total: items.length, completed };
  };

  const getPriorityPendingCount = (priority: TaskPriority) =>
    pendingTasks.filter((t) => t.priority === priority).length;

  return (
    <div className="space-y-8">
      {/* Statistics Strip */}
      <StatsGrid stats={stats} loading={loading} />

      {/* Main Content Split: Focus List + Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Active & Priority Focus */}
        <section className="xl:col-span-2 space-y-4" aria-label="Priority focus tasks">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#1E1B2E]">
                {searchQuery ? 'Matching Tasks' : 'Active Focus'}
              </h2>
              <p className="text-sm text-[#524B69]">
                {searchQuery
                  ? `Showing results for "${searchQuery}"`
                  : 'Pending tasks ordered by due date and priority.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateView('all')}
              className="h-9 px-3 rounded-xl text-sm font-medium text-[#6D28D9] hover:bg-[#EDE9FE]/70 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <TaskList
            tasks={filteredFocusTasks.slice(0, 6)}
            loading={loading}
            error={error}
            mutatingTaskId={mutatingTaskId}
            activeView="dashboard"
            hasActiveFilters={Boolean(searchQuery.trim())}
            onRetry={onRetry}
            onClearFilters={onClearSearch}
            onOpenAddModal={onOpenAddModal}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </section>

        {/* Right Column: Category & Priority Breakdown */}
        <aside className="space-y-5" aria-label="Workspace breakdown">
          {/* Categories Panel */}
          <div className="bg-white border border-[#E6E0F4] rounded-xl p-5">
            <h2 className="font-display text-base font-bold text-[#1E1B2E]">
              By Category
            </h2>
            <p className="mt-0.5 text-xs text-[#7A7294]">
              Click a category to open its filtered task list.
            </p>
            <div className="mt-4 divide-y divide-[#EDE9F7]">
              {CATEGORIES.map((category) => {
                const { total, completed } = getCategoryStats(category);
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => onSelectCategoryView(category)}
                    className="w-full py-3 first:pt-1 last:pb-1 text-left group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[#1E1B2E] group-hover:text-[#6D28D9] transition-colors">
                        {category}
                      </span>
                      <span className="text-xs text-[#6B6385] tabular-nums">
                        {completed}/{total} done
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-[#F4F1FC] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#6D28D9] transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pending Priority Distribution */}
          <div className="bg-white border border-[#E6E0F4] rounded-xl p-5">
            <h2 className="font-display text-base font-bold text-[#1E1B2E]">
              Pending by Priority
            </h2>
            <p className="mt-0.5 text-xs text-[#7A7294] tabular-nums">
              {totalPending} active {totalPending === 1 ? 'task' : 'tasks'} remaining
            </p>
            <div className="mt-4 space-y-3.5">
              {PRIORITIES.map(({ key, color }) => {
                const count = getPriorityPendingCount(key);
                const widthPercent =
                  totalPending > 0 ? Math.round((count / totalPending) * 100) : 0;

                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#524B69] font-medium">{key}</span>
                      <span className="text-xs font-semibold text-[#1E1B2E] tabular-nums">
                        {count}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#F4F1FC] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${color}`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
