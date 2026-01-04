"use client";

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toast as ToastType, useToast } from '@/lib/hooks/useToast';

const toastStyles = {
  success: {
    container: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    icon: 'text-emerald-400',
    Icon: CheckCircle,
  },
  error: {
    container: 'bg-red-500/10 border-red-500/30 text-red-400',
    icon: 'text-red-400',
    Icon: XCircle,
  },
  warning: {
    container: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    icon: 'text-yellow-400',
    Icon: AlertCircle,
  },
  info: {
    container: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    icon: 'text-blue-400',
    Icon: Info,
  },
};

export function Toast({ toast }: { toast: ToastType }) {
  const { hideToast } = useToast();
  const style = toastStyles[toast.type];
  const Icon = style.Icon;

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg',
        'animate-slide-in-right min-w-[300px] max-w-md',
        style.container
      )}
    >
      <Icon size={20} className={style.icon} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => hideToast(toast.id)}
        className="text-slate-400 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
