'use client';

import { toast } from 'sonner';
import { Check, X, Loader2 } from 'lucide-react';

export const Toaster = {
  success: (title, subtitle = '', credits = 0, options = {}) => {
    return toast.custom(() => (
      <div className="bg-[#624CF5] text-white border border-gray-100 shadow-xl p-4 w-[350px] backdrop-blur-sm bg-opacity-60">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-white mt-0.5" />
          <div>
            <div className="font-semibold text-white">{title}</div>
            {subtitle && (
              <div className="text-sm text-white mt-1 flex items-center gap-1">
                {credits > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 text-xs rounded-full font-medium bg-white text-black">
                    {credits} credit{credits !== 1 ? 's' : ''}
                  </span>
                )}
                {subtitle}
              </div>
            )}
          </div>
        </div>
      </div>
    ), {
      duration: options.duration || 3000,
      position: 'bottom-right',
      ...options
    });
  },

  error: (title, subtitle = '', options = {}) => {
    return toast.custom(() => (
      <div className="bg-[#624CF5] text-white border border-gray-100 rounded-xl shadow-xl p-4 w-[350px] backdrop-blur-sm bg-opacity-60">
        <div className="flex items-start gap-3">
          <X className="w-5 h-5 text-rose-500 mt-0.5" />
          <div>
            <div className="font-semibold text-gray-900">{title}</div>
            {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
          </div>
        </div>
      </div>
    ), {
      duration: options.duration || 3000,
      position: 'bottom-right',
      ...options
    });
  },

  loading: (title = 'Processing...', options = {}) => {
    return toast.custom((id) => (
      <div className="bg-white text-gray-800 border border-gray-100 rounded-xl shadow-xl p-4 w-[350px] backdrop-blur-sm bg-opacity-90">
        <div className="flex items-start gap-3">
          <Loader2 className="w-5 h-5 text-blue-500 mt-0.5 animate-spin" />
          <div className="font-semibold text-gray-900">{title}</div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'bottom-right',
      ...options
    });
  },

  dismiss: (id) => {
    toast.dismiss(id);
  }
};