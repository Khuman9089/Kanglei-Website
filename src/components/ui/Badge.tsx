import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({ className = '', variant = 'default', size = 'md', dot = false, children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  const variants = {
    default: 'bg-[#1c2541] text-[#f5f0e8] hover:bg-[#3a506b]',
    gold: 'bg-[#c69214]/20 text-[#c69214] border border-[#c69214]/50',
    success: 'bg-green-500/20 text-green-400 border border-green-500/50',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/50',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/50',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {dot && (
        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${variant === 'default' ? 'bg-[#f5f0e8]' : 'bg-current'}`} />
      )}
      {children}
    </div>
  );
}
