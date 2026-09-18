import React from 'react';
import { Dignity } from '../../types/astronomy';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'cyan' | 'ruby' | 'emerald' | 'purple' | 'slate';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  className = '',
  icon,
}) => {
  const variantStyles = {
    gold: 'bg-amber-50 text-amber-900 border-amber-300 font-semibold',
    cyan: 'bg-cyan-50 text-cyan-900 border-cyan-300 font-semibold',
    ruby: 'bg-rose-50 text-rose-900 border-rose-300 font-semibold',
    emerald: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold',
    purple: 'bg-purple-50 text-purple-900 border-purple-300 font-semibold',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md font-medium tracking-tight',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium',
    lg: 'text-sm px-3.5 py-1.5 rounded-xl font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="flex-shrink-0 text-current">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export const DignityBadge: React.FC<{ dignity: Dignity }> = ({ dignity }) => {
  switch (dignity) {
    case 'Exalted':
      return <Badge variant="emerald" size="sm">Exalted (उच्च)</Badge>;
    case 'Moolatrikona':
      return <Badge variant="gold" size="sm">Moolatrikona (मूल)</Badge>;
    case 'Own':
      return <Badge variant="gold" size="sm">Own Sign (स्व)</Badge>;
    case 'Great Friend':
    case 'Friend':
      return <Badge variant="cyan" size="sm">Friend (मित्र)</Badge>;
    case 'Neutral':
      return <Badge variant="slate" size="sm">Neutral (सम)</Badge>;
    case 'Enemy':
    case 'Great Enemy':
      return <Badge variant="purple" size="sm">Enemy (शत्रु)</Badge>;
    case 'Debilitated':
      return <Badge variant="ruby" size="sm">Debilitated (नीच)</Badge>;
    default:
      return <Badge variant="slate" size="sm">{dignity}</Badge>;
  }
};
