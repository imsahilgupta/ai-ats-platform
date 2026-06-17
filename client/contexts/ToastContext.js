'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export const ToastContext = createContext(null);

let _id = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = ++_id;
        setToasts(prev => [...prev, { id, message, type, exiting: false }]);

        // Auto-dismiss after 4s
        setTimeout(() => {
            // Mark as exiting first (trigger CSS exit animation)
            setToasts(prev =>
                prev.map(t => t.id === id ? { ...t, exiting: true } : t)
            );
            // Remove after exit animation completes (220ms)
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 240);
        }, 4000);
    }, []);

    const dismiss = useCallback((id) => {
        setToasts(prev =>
            prev.map(t => t.id === id ? { ...t, exiting: true } : t)
        );
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 240);
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, dismiss }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx;
}
