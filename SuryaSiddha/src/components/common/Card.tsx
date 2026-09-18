import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  glow?: 'gold' | 'cyan' | 'ruby' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  icon,
  action,
  glow = 'none',
}) => {
  const glowStyles = {
    gold: 'border-amber-300/80 shadow-md shadow-amber-900/5',
    cyan: 'border-cyan-300/80 shadow-md shadow-cyan-900/5',
    ruby: 'border-rose-300/80 shadow-md shadow-rose-900/5',
    none: 'border-amber-200/70 shadow-sm shadow-amber-900/5',
  };

  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 md:p-6 transition-all duration-300 ${glowStyles[glow]} border ${className}`}
    >
      {(title || icon || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {icon && <div className="text-amber-600 flex-shrink-0">{icon}</div>}
            <div className="min-w-0 flex-1">
              {title && (
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 tracking-wide leading-snug">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 font-sans tracking-normal mt-0.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="flex-shrink-0 w-full sm:w-auto">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
