import type {
  SidebarView,
  Task,
  TaskCategory,
  TaskPriority,
  TaskSortOption,
  TaskStats,
} from '../types/task';

export function getLocalTodayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLocalTomorrowIso(): string {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isDueToday(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return dueDate === getLocalTodayIso();
}

export function isUpcoming(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return dueDate > getLocalTodayIso();
}

export function isOverdue(task: Task): boolean {
  if (task.is_completed || !task.due_date) return false;
  return task.due_date < getLocalTodayIso();
}

export function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return 'No due date';
  const today = getLocalTodayIso();
  const tomorrow = getLocalTomorrowIso();

  if (dueDate === today) return 'Today';
  if (dueDate === tomorrow) return 'Tomorrow';

  const [year, month, day] = dueDate.split('-').map(Number);
  if (!year || !month || !day) return dueDate;

  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: year !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}

export function computeTaskStats(tasks: Task[]): TaskStats {
  let completed = 0;
  let pending = 0;
  let today = 0;
  let upcoming = 0;
  let overdue = 0;

  for (const task of tasks) {
    if (task.is_completed) {
      completed += 1;
    } else {
      pending += 1;
      if (isDueToday(task.due_date)) today += 1;
      if (isUpcoming(task.due_date)) upcoming += 1;
      if (isOverdue(task)) overdue += 1;
    }
  }

  return {
    total: tasks.length,
    completed,
    pending,
    today,
    upcoming,
    overdue,
  };
}

const PRIORITY_RANK: Record<TaskPriority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

export interface FilterOptions {
  view: SidebarView;
  searchQuery: string;
  category: TaskCategory | 'All';
  priority: TaskPriority | 'All';
  sortBy: TaskSortOption;
}

export function filterAndSortTasks(tasks: Task[], options: FilterOptions): Task[] {
  const normalizedQuery = options.searchQuery.trim().toLowerCase();

  const filtered = tasks.filter((task) => {
    if (options.view === 'today') {
      if (task.is_completed || !isDueToday(task.due_date)) return false;
    } else if (options.view === 'upcoming') {
      if (task.is_completed || !isUpcoming(task.due_date)) return false;
    } else if (options.view === 'completed') {
      if (!task.is_completed) return false;
    }

    if (options.category !== 'All' && task.category !== options.category) {
      return false;
    }

    if (options.priority !== 'All' && task.priority !== options.priority) {
      return false;
    }

    if (normalizedQuery) {
      const inTitle = task.title.toLowerCase().includes(normalizedQuery);
      const inDescription = task.description.toLowerCase().includes(normalizedQuery);
      const inCategory = task.category.toLowerCase().includes(normalizedQuery);
      if (!inTitle && !inDescription && !inCategory) {
        return false;
      }
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    if (a.is_completed !== b.is_completed) {
      return a.is_completed ? 1 : -1;
    }

    if (options.sortBy === 'priority') {
      const rankDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (rankDiff !== 0) return rankDiff;
    }

    if (options.sortBy === 'due_date' || options.sortBy === 'priority') {
      if (a.due_date && b.due_date) {
        if (a.due_date !== b.due_date) {
          return a.due_date.localeCompare(b.due_date);
        }
      } else if (a.due_date && !b.due_date) {
        return -1;
      } else if (!a.due_date && b.due_date) {
        return 1;
      }
    }

    return b.created_at.localeCompare(a.created_at);
  });
}

export function getUserInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return 'TM';
}
