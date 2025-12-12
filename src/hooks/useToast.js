/**
 * useToast Hook
 * Custom hook to access toast functionality
 */

import { useContext } from 'react';
import { ToastContext } from '../contexts/toastContext.js';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

