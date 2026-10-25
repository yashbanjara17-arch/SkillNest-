import React from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'subtle' | 'elevated' | 'glow' | 'solid';
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'subtle',
  interactive = false,
  ...props
}) => {
  const variantStyles = {
    subtle: 'bg-white/85 dark:bg-slate-900/75 backdrop-blur-md border border-neutral-200/80 dark:border-slate-800/80 shadow-xs',
    elevated: 'bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-neutral-200/90 dark:border-slate-700/60 shadow-lg shadow-neutral-900/5',
    glow: 'bg-gradient-to-b from-white/95 via-white/85 to-indigo-50/30 dark:from-slate-900/90 dark:to-indigo-950/20 backdrop-blur-xl border border-indigo-200/60 dark:border-indigo-500/20 shadow-md',
    solid: 'bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 shadow-xs'
  };

  const interactiveStyles = interactive
    ? 'hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-200 cursor-pointer'
    : '';

  return (
    <div
      className={cn(
        'rounded-2xl p-6 relative overflow-hidden',
        variantStyles[variant],
        interactiveStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
