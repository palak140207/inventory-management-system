import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="text-emerald-400 w-5 h-5 flex-shrink-0" />;
    case 'error':
      return <AlertCircle className="text-rose-400 w-5 h-5 flex-shrink-0" />;
    case 'warning':
      return <AlertTriangle className="text-amber-400 w-5 h-5 flex-shrink-0" />;
    default:
      return <Info className="text-sky-400 w-5 h-5 flex-shrink-0" />;
  }
};

const ToastItem = ({ id, message, type, onRemove }) => {
  const borderColors = {
    success: 'border-emerald-500/30 bg-slate-900/90 text-emerald-50',
    error: 'border-rose-500/30 bg-slate-900/90 text-rose-50',
    warning: 'border-amber-500/30 bg-slate-900/90 text-amber-50',
    info: 'border-sky-500/30 bg-slate-900/90 text-sky-50',
  };

  const glowEffects = {
    success: 'shadow-lg shadow-emerald-500/5',
    error: 'shadow-lg shadow-rose-500/5',
    warning: 'shadow-lg shadow-amber-500/5',
    info: 'shadow-lg shadow-sky-500/5',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 border rounded-xl animate-slide-up ${borderColors[type]} ${glowEffects[type]} min-w-[280px] max-w-sm`}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <ToastIcon type={type} />
      <p className="text-xs font-medium flex-1 pr-2 leading-relaxed">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="text-slate-400 hover:text-slate-200 p-0.5 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-full">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};
