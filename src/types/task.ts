export type TaskPriority = 'Low' | 'Medium' | 'High';

export type TaskCategory = 'Personal' | 'College' | 'Work';

export type SidebarView = 'dashboard' | 'all' | 'today' | 'upcoming' | 'completed';

export type TaskSortOption = 'due_date' | 'priority' | 'created_at';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  due_date: string | null;
  priority: TaskPriority;
  category: TaskCategory;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskInput {
  title: string;
  description: string;
  due_date: string | null;
  priority: TaskPriority;
  category: TaskCategory;
}

export interface TaskUpdateInput extends Partial<TaskInput> {
  is_completed?: boolean;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  today: number;
  upcoming: number;
  overdue: number;
}
