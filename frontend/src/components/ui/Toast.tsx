import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
          info: <Info className="w-4 h-4 text-indigo-500 shrink-0" />,
        };

        const borderStyles = {
          success: 'border-emerald-200/80 bg-white/95 text-neutral-900',
          error: 'border-rose-200/80 bg-white/95 text-neutral-900',
          warning: 'border-amber-200/80 bg-white/95 text-neutral-900',
          info: 'border-indigo-200/80 bg-white/95 text-neutral-900',
        };

        const type = toast.type || 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl p-3.5 shadow-lg shadow-neutral-900/10 backdrop-blur-md border ${borderStyles[type]} flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5">{icons[type]}</span>
              <div>
                <p className="text-xs font-bold leading-snug">{toast.title}</p>
                {toast.description && (
                  <p className="text-[11px] text-neutral-600 mt-0.5 leading-normal">
                    {toast.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-600 p-0.5 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
