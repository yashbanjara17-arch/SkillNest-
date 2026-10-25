import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white/70 backdrop-blur-md p-10 text-center max-w-md mx-auto my-6 space-y-4">
      <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto text-neutral-500 shadow-2xs">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-base font-bold text-neutral-900">{title}</h4>
        <p className="text-xs text-neutral-500 mt-1 leading-relaxed max-w-sm mx-auto">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-1">
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
