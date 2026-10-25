import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'indigo' | 'glass';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700',
    success: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800',
    glass: 'bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xs text-neutral-800 dark:text-neutral-200 border-neutral-200/60 dark:border-neutral-700/60 shadow-2xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
