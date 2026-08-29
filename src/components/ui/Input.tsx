import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isTextarea?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className = '', label, error, helperText, isTextarea, ...props }, ref) => {
    const baseClasses = `flex w-full rounded-xl border border-[#fde68a] bg-[#fefcf6] px-4 py-2.5 text-sm font-bold text-[#0f172a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d97706]/40 focus:border-[#d97706] disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
      error ? 'border-rose-500 focus:ring-rose-500' : ''
    } ${className}`;

    return (
      <div className="w-full">
        {label && <label className="mb-1.5 block text-sm font-extrabold text-[#0f172a]">{label}</label>}
        {isTextarea ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={`${baseClasses} min-h-[90px]`}
            {...(props as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            className={baseClasses}
            {...props}
          />
        )}
        {error && <p className="mt-1 text-xs font-bold text-rose-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
