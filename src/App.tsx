/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { BrandLogo } from './components/BrandLogo';
import { DashboardOverview } from './components/DashboardOverview';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Sidebar } from './components/Sidebar';
import { StatsGrid } from './components/StatsGrid';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { TopNavbar } from './components/TopNavbar';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import type {
  SidebarView,
  Task,
  TaskCategory,
  TaskInput,
  TaskPriority,
  TaskSortOption,
} from './types/task';
import { computeTaskStats, filterAndSortTasks } from './utils/taskUtils';

export default function App() {
  const {
    user,
    loading: authLoading,
    authActionLoading,
    error: authError,
    notice: authNotice,
    isSupabaseConfigured,
    signIn,
    signUp,
    signOut,
    clearMessages,
  } = useAuth();

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    mutatingTaskId,
    refreshTasks,
    addTask,
    editTask,
    toggleTaskComplete,
    removeTask,
  } = useTasks(user?.id);

  const [activeView, setActiveView] = useState<SidebarView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'All'>('All');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'All'>('All');
  const [sortBy, setSortBy] = useState<TaskSortOption>('due_date');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const stats = useMemo(() => computeTaskStats(tasks), [tasks]);

  const categoryCounts = useMemo<Record<TaskCategory, number>>(() => {
    const counts: Record<TaskCategory, number> = {
      Personal: 0,
      College: 0,
      Work: 0,
    };
    for (const task of tasks) {
      if (!task.is_completed) {
        counts[task.category] += 1;
      }
    }
    return counts;
  }, [tasks]);

  const filteredTasks = useMemo(
    () =>
      filterAndSortTasks(tasks, {
        view: activeView,
        searchQuery,
        category: selectedCategory,
        priority: selectedPriority,
        sortBy,
      }),
    [tasks, activeView, searchQuery, selectedCategory, selectedPriority, sortBy]
  );

  const dashboardFocusTasks = useMemo(() => {
    const pendingOnly = tasks.filter((t) => !t.is_completed);
    return filterAndSortTasks(pendingOnly, {
      view: 'all',
      searchQuery,
      category: 'All',
      priority: 'All',
      sortBy: 'due_date',
    });
  }, [tasks, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (input: TaskInput, editingTaskId?: string) => {
    if (editingTaskId) {
      await editTask(editingTaskId, input);
    } else {
      await addTask(input);
    }
  };

  const handleConfirmDelete = async (taskId: string) => {
    await removeTask(taskId);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPriority('All');
  };

  const handleSelectCategoryFromDashboard = (category: TaskCategory) => {
    setSelectedCategory(category);
    setActiveView('all');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9FE] flex flex-col items-center justify-center gap-4 px-4">
        <BrandLogo />
        <div className="flex items-center gap-2.5 text-sm text-[#524B69]">
          <span className="h-4 w-4 border-2 border-[#DDD6FE] border-t-[#6D28D9] rounded-full animate-spin" />
          <span>Loading your workspace...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthScreen
        isSupabaseConfigured={isSupabaseConfigured}
        authActionLoading={authActionLoading}
        error={authError}
        notice={authNotice}
        onSignIn={signIn}
        onSignUp={signUp}
        onClearMessages={clearMessages}
      />
    );
  }

  const userName =
    (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim()) ||
    user.email?.split('@')[0] ||
    'User';
  const userEmail = user.email ?? '';
  const hasActiveFilters =
    Boolean(searchQuery.trim()) || selectedCategory !== 'All' || selectedPriority !== 'All';

  return (
    <div className="min-h-screen bg-[#FAF9FE] flex">
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        stats={stats}
        categoryCounts={categoryCounts}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        userEmail={userEmail}
        userName={userName}
        onSignOut={signOut}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopNavbar
          activeView={activeView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAddModal={handleOpenAddModal}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          userName={userName}
          userEmail={userEmail}
          onSignOut={signOut}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl w-full mx-auto">
          {activeView === 'dashboard' ? (
            <DashboardOverview
              tasks={tasks}
              filteredFocusTasks={dashboardFocusTasks}
              stats={stats}
              loading={tasksLoading}
              error={tasksError}
              mutatingTaskId={mutatingTaskId}
              searchQuery={searchQuery}
              onNavigateView={setActiveView}
              onSelectCategoryView={handleSelectCategoryFromDashboard}
              onRetry={refreshTasks}
              onClearSearch={() => setSearchQuery('')}
              onOpenAddModal={handleOpenAddModal}
              onToggleComplete={toggleTaskComplete}
              onEdit={handleOpenEditModal}
              onDelete={setDeletingTask}
            />
          ) : (
            <div className="space-y-6">
              <StatsGrid stats={stats} loading={tasksLoading} />

              <TaskFilters
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedPriority={selectedPriority}
                onSelectPriority={setSelectedPriority}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              <TaskList
                tasks={filteredTasks}
                loading={tasksLoading}
                error={tasksError}
                mutatingTaskId={mutatingTaskId}
                activeView={activeView}
                hasActiveFilters={hasActiveFilters}
                onRetry={refreshTasks}
                onClearFilters={handleClearFilters}
                onOpenAddModal={handleOpenAddModal}
                onToggleComplete={toggleTaskComplete}
                onEdit={handleOpenEditModal}
                onDelete={setDeletingTask}
              />
            </div>
          )}
        </main>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        editingTask={editingTask}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />

      <DeleteConfirmModal
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
