import React, { createContext, useCallback, useContext, useState } from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-md shadow-lg text-sm font-medium border ${
              t.type === 'error'
                ? 'bg-maroon-600/90 border-maroon-500 text-parchment-100'
                : 'bg-ink-800 border-brass-500/40 text-parchment-100'
            }`}
          >
            {t.type === 'error' ? <FiXCircle className="text-parchment-100" /> : <FiCheckCircle className="text-brass-400" />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
