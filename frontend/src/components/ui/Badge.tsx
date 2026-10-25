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
    default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    glass: 'bg-white/60 backdrop-blur-xs text-neutral-800 border-white/40 shadow-2xs',
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
