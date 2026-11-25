interface BrandLogoProps {
  size?: 'sm' | 'md';
}

export function BrandLogo({ size = 'md' }: BrandLogoProps) {
  const iconBoxClass = size === 'sm' ? 'h-8 w-8 rounded-lg' : 'h-9 w-9 rounded-xl';
  const textClass = size === 'sm' ? 'text-lg' : 'text-xl';

  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
      <div
        className={`${iconBoxClass} bg-[#6D28D9] text-white flex items-center justify-center shrink-0`}
        aria-hidden="true"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 11l3 3L20 6" />
          <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />
        </svg>
      </div>
      <span
        className={`${textClass} font-display font-bold tracking-tight text-[#1E1B2E] whitespace-nowrap shrink-0`}
      >
        TaskMate
      </span>
    </div>
  );
}
