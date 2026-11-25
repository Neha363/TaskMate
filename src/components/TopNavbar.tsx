import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Menu, Plus, Search, X } from 'lucide-react';
import type { SidebarView } from '../types/task';
import { getUserInitials } from '../utils/taskUtils';

interface TopNavbarProps {
  activeView: SidebarView;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenAddModal: () => void;
  onOpenMobileMenu: () => void;
  userName: string;
  userEmail: string;
  onSignOut: () => void;
}

const VIEW_TITLES: Record<SidebarView, string> = {
  dashboard: 'Dashboard',
  all: 'All Tasks',
  today: 'Today',
  upcoming: 'Upcoming',
  completed: 'Completed',
};

export function TopNavbar({
  activeView,
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenMobileMenu,
  userName,
  userEmail,
  onSignOut,
}: TopNavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = getUserInitials(userName, userEmail);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-[#E6E0F4] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
      {/* Left: Mobile Menu Toggle + View Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl border border-[#E6E0F4] text-[#524B69] hover:bg-[#F4F1FC] hover:text-[#1E1B2E] transition-colors shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg sm:text-xl font-bold text-[#1E1B2E] truncate">
          {VIEW_TITLES[activeView]}
        </h1>
      </div>

      {/* Center / Right: Search Field + Add Task CTA + Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4 flex-1 justify-end max-w-2xl">
        <div className="relative flex-1 max-w-xs sm:max-w-sm">
          <Search className="h-4 w-4 text-[#8D85A5] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            aria-label="Search tasks"
            className="w-full h-10 pl-9 pr-8 text-sm bg-[#FAF9FE] border border-[#E6E0F4] rounded-xl text-[#1E1B2E] placeholder:text-[#8D85A5] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-md text-[#7A7294] hover:text-[#1E1B2E] hover:bg-[#EDE9FE] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="h-10 px-3.5 sm:px-4 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Add Task</span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className="h-10 pl-1.5 pr-2.5 rounded-xl border border-[#E6E0F4] hover:bg-[#F7F5FF] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span className="h-7 w-7 rounded-lg bg-[#EDE9FE] text-[#5B21B6] text-xs font-display font-bold flex items-center justify-center shrink-0">
              {initials}
            </span>
            <span className="hidden md:inline text-sm font-medium text-[#1E1B2E] max-w-[120px] truncate">
              {userName}
            </span>
            <ChevronDown className="h-4 w-4 text-[#7A7294] shrink-0" />
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-60 bg-white border border-[#E6E0F4] rounded-xl shadow-lg py-2 z-40"
            >
              <div className="px-4 py-2.5 border-b border-[#EDE9F7]">
                <p className="text-sm font-semibold text-[#1E1B2E] truncate">{userName}</p>
                <p className="text-xs text-[#7A7294] truncate">{userEmail}</p>
              </div>
              <div className="px-2 pt-1.5">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    onSignOut();
                  }}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg flex items-center gap-2.5 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
