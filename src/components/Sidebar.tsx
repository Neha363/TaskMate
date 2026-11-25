import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  LayoutDashboard,
  ListTodo,
  LogOut,
  X,
} from 'lucide-react';
import type { SidebarView, TaskCategory, TaskStats } from '../types/task';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  activeView: SidebarView;
  onSelectView: (view: SidebarView) => void;
  activeCategory: TaskCategory | 'All';
  onSelectCategory: (category: TaskCategory | 'All') => void;
  stats: TaskStats;
  categoryCounts: Record<TaskCategory, number>;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  userEmail: string;
  userName: string;
  onSignOut: () => void;
}

const NAV_ITEMS: Array<{
  id: SidebarView;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'all', label: 'All Tasks', icon: ListTodo },
  { id: 'today', label: 'Today', icon: CalendarDays },
  { id: 'upcoming', label: 'Upcoming', icon: CalendarClock },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
];

const CATEGORIES: TaskCategory[] = ['Personal', 'College', 'Work'];

export function Sidebar({
  activeView,
  onSelectView,
  activeCategory,
  onSelectCategory,
  stats,
  categoryCounts,
  isMobileOpen,
  onCloseMobile,
  userEmail,
  userName,
  onSignOut,
}: SidebarProps) {
  const getCountForView = (view: SidebarView): number | null => {
    switch (view) {
      case 'all':
        return stats.total;
      case 'today':
        return stats.today;
      case 'upcoming':
        return stats.upcoming;
      case 'completed':
        return stats.completed;
      default:
        return null;
    }
  };

  const handleNavClick = (view: SidebarView) => {
    onSelectView(view);
    onCloseMobile();
  };

  const handleCategoryClick = (category: TaskCategory) => {
    if (activeView === 'dashboard') {
      onSelectView('all');
    }
    onSelectCategory(activeCategory === category ? 'All' : category);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-[#E6E0F4]">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-[#EDE9F7] shrink-0">
        <BrandLogo size="sm" />
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg text-[#524B69] hover:bg-[#F4F1FC] hover:text-[#1E1B2E] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6" aria-label="Primary">
        <div>
          <p className="px-3 mb-2 text-xs font-medium text-[#7A7294]">Workspace</p>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              const count = getCountForView(item.id);

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full min-h-[42px] px-3 py-2 rounded-xl flex items-center justify-between text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#EDE9FE] text-[#5B21B6]'
                        : 'text-[#524B69] hover:bg-[#F7F5FF] hover:text-[#1E1B2E]'
                    }`}
                  >
                    <span className="flex items-center gap-3 whitespace-nowrap">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? 'text-[#6D28D9]' : 'text-[#8D85A5]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </span>
                    {count !== null && (
                      <span
                        className={`text-xs tabular-nums ${
                          isActive ? 'text-[#5B21B6] font-semibold' : 'text-[#8D85A5]'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Category Filter Shortcut */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-[#7A7294]">Categories</p>
            {activeCategory !== 'All' && (
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('All');
                  onCloseMobile();
                }}
                className="text-xs font-medium text-[#6D28D9] hover:text-[#5B21B6] cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          <ul className="space-y-1">
            {CATEGORIES.map((category) => {
              const isSelected = activeCategory === category && activeView !== 'dashboard';
              return (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full min-h-[40px] px-3 py-2 rounded-xl flex items-center justify-between text-sm transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#F4F1FC] text-[#5B21B6] font-medium'
                        : 'text-[#524B69] hover:bg-[#F7F5FF] hover:text-[#1E1B2E]'
                    }`}
                  >
                    <span className="whitespace-nowrap">{category}</span>
                    <span className="text-xs text-[#8D85A5] tabular-nums">
                      {categoryCounts[category]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Account Footer */}
      <div className="p-3.5 border-t border-[#EDE9F7] shrink-0">
        <div className="px-2.5 py-2 mb-1">
          <p className="text-sm font-medium text-[#1E1B2E] truncate">{userName}</p>
          <p className="text-xs text-[#7A7294] truncate">{userEmail}</p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="w-full min-h-[40px] px-3 py-2 rounded-xl flex items-center gap-2.5 text-sm font-medium text-[#524B69] hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#1E1B2E]/30 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[82vw] h-full z-10 shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
