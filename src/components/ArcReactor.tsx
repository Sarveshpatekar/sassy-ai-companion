
import React from 'react';
import { cn } from '@/lib/utils';

interface ArcReactorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulsing?: boolean;
}

const ArcReactor: React.FC<ArcReactorProps> = ({ 
  size = 'md', 
  className,
  pulsing = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  return (
    <div 
      className={cn(
        'arc-reactor relative rounded-full', 
        sizeClasses[size],
        pulsing && 'animate-arc-reactor',
        className
      )}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-jarvis-primary/80 to-jarvis-secondary/60 blur-sm"></div>
      <div className="absolute inset-[15%] rounded-full bg-jarvis-dark border border-jarvis-primary/30"></div>
      <div className="absolute inset-[30%] rounded-full bg-jarvis-primary/30 flex items-center justify-center">
        <div className="absolute inset-[20%] rounded-full bg-jarvis-primary"></div>
      </div>
    </div>
  );
};

export default ArcReactor;
