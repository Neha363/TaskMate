import { ArrowUpDown } from 'lucide-react';
import type { TaskCategory, TaskPriority, TaskSortOption } from '../types/task';

interface TaskFiltersProps {
  selectedCategory: TaskCategory | 'All';
  onSelectCategory: (category: TaskCategory | 'All') => void;
  selectedPriority: TaskPriority | 'All';
  onSelectPriority: (priority: TaskPriority | 'All') => void;
  sortBy: TaskSortOption;
  onSortChange: (sortBy: TaskSortOption) => void;
}

const CATEGORIES: Array<TaskCategory | 'All'> = ['All', 'Personal', 'College', 'Work'];
const PRIORITIES: Array<TaskPriority | 'All'> = ['All', 'High', 'Medium', 'Low'];

export function TaskFilters({
  selectedCategory,
  onSelectCategory,
  selectedPriority,
  onSelectPriority,
  sortBy,
  onSortChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Category Segmented Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="inline-flex items-center p-1 bg-[#F4F1FC] rounded-xl border border-[#E6E0F4]/80"
          role="group"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={`min-h-[34px] px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-[#1E1B2E] shadow-xs'
                    : 'text-[#524B69] hover:text-[#1E1B2E]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Priority Segmented Filter */}
        <div
          className="inline-flex items-center p-1 bg-[#F4F1FC] rounded-xl border border-[#E6E0F4]/80"
          role="group"
          aria-label="Filter by priority"
        >
          {PRIORITIES.map((priority) => {
            const active = selectedPriority === priority;
            return (
              <button
                key={priority}
                type="button"
                onClick={() => onSelectPriority(priority)}
                className={`min-h-[34px] px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-[#1E1B2E] shadow-xs'
                    : 'text-[#524B69] hover:text-[#1E1B2E]'
                }`}
              >
                {priority === 'All' ? 'All Priorities' : priority}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort Selector */}
      <div className="flex items-center gap-2 self-start lg:self-auto">
        <ArrowUpDown className="h-4 w-4 text-[#7A7294] shrink-0" aria-hidden="true" />
        <label htmlFor="task-sort-select" className="text-xs font-medium text-[#524B69] whitespace-nowrap">
          Sort by
        </label>
        <select
          id="task-sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as TaskSortOption)}
          className="h-9 px-3 text-sm bg-white border border-[#E6E0F4] rounded-xl text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] cursor-pointer"
        >
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
          <option value="created_at">Newest First</option>
        </select>
      </div>
    </div>
  );
}
