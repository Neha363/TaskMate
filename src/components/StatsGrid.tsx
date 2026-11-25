import { CheckCircle2, Clock3, Layers } from 'lucide-react';
import type { TaskStats } from '../types/task';

interface StatsGridProps {
  stats: TaskStats;
  loading: boolean;
}

export function StatsGrid({ stats, loading }: StatsGridProps) {
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const cards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      caption: stats.overdue > 0 ? `${stats.overdue} overdue` : 'Across all categories',
      icon: Layers,
      iconBg: 'bg-[#F4F1FC] text-[#6D28D9]',
    },
    {
      label: 'Completed Tasks',
      value: stats.completed,
      caption: `${completionRate}% completion rate`,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Pending Tasks',
      value: stats.pending,
      caption: `${stats.today} due today`,
      icon: Clock3,
      iconBg: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <section aria-label="Task statistics" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white border border-[#E6E0F4] rounded-xl p-5 flex items-start justify-between gap-4 transition-colors hover:border-[#D4C9F0]"
          >
            <div>
              <p className="text-sm font-medium text-[#524B69]">{card.label}</p>
              {loading ? (
                <div className="mt-2 h-8 w-16 rounded-md bg-[#F4F1FC] animate-pulse" />
              ) : (
                <p className="mt-1.5 font-display text-3xl font-bold text-[#1E1B2E] tabular-nums">
                  {card.value}
                </p>
              )}
              <p className="mt-1.5 text-xs text-[#7A7294] tabular-nums">{card.caption}</p>
            </div>
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
              aria-hidden="true"
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        );
      })}
    </section>
  );
}
