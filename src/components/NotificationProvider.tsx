/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface NotificationContextType {
  showToast: (message: string, type?: ToastType) => void;
  confirm: (options: ConfirmOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmOptions | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const confirm = (options: ConfirmOptions) => {
    setConfirmModal(options);
  };

  const handleConfirmAction = () => {
    if (confirmModal) {
      confirmModal.onConfirm();
      setConfirmModal(null);
    }
  };

  return (
    <NotificationContext.Provider value={{ showToast, confirm }}>
      {children}
      
      {/* Toast Overlay */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            let Icon = Info;
            let bgColor = 'bg-white border-brand-purple';
            let textColor = 'text-brand-dark-text';
            let iconColor = 'text-brand-dark';

            if (toast.type === 'success') {
              Icon = CheckCircle;
              bgColor = 'bg-[#f5faf6] border-emerald-200';
              iconColor = 'text-emerald-600';
            } else if (toast.type === 'error') {
              Icon = XCircle;
              bgColor = 'bg-[#fffafb] border-red-200';
              iconColor = 'text-red-600';
            } else if (toast.type === 'warning') {
              Icon = AlertTriangle;
              bgColor = 'bg-[#fffdf9] border-amber-200';
              iconColor = 'text-amber-600';
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                transition={{ duration: 0.2 }}
                className={`p-4 rounded-xl border flex items-start gap-3 shadow-lg pointer-events-auto ${bgColor}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${iconColor} mt-0.5`} />
                <div className="flex-1 text-sm font-medium leading-5">
                  {toast.message}
                </div>
                <button
                  onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                  className="text-gray-400 hover:text-gray-600 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Confirmation Dialog Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setConfirmModal(null)}
            />

            {/* Content Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-brand-purple shadow-2xl max-w-md w-full p-6 relative z-10 overflow-hidden"
            >
              {/* Soft decorative visual background line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-purple" />
              
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2 mt-2">
                {confirmModal.title}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {confirmModal.message}
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {confirmModal.cancelText || 'Cancel'}
                </button>
                <button
                  onClick={handleConfirmAction}
                  className="px-4 py-2 bg-brand-dark text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors shadow-sm"
                >
                  {confirmModal.confirmText || 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
}
