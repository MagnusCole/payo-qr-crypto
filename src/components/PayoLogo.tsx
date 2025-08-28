import React from 'react';
import { Zap } from 'lucide-react';

interface PayoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const PayoLogo: React.FC<PayoLogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow-primary`}>
        <Zap className="text-primary-foreground w-1/2 h-1/2" fill="currentColor" />
      </div>
      {showText && (
        <span className={`font-bold bg-gradient-primary bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          Payo
        </span>
      )}
    </div>
  );
};