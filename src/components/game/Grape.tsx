import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface GrapeProps {
  x: number;
  y: number;
  speed: number;
  className?: string;
}

const Grape = forwardRef<HTMLDivElement, GrapeProps>(({ x, y, speed, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute w-6 h-6 bg-gradient-to-br from-game-grape-light to-game-grape rounded-full",
        "shadow-md shadow-game-grape/40 border border-game-grape-light/30",
        "animate-fall-slow",
        className
      )}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translateX(-50%)',
        animationDuration: `${4 / speed}s`,
      }}
    >
      {/* Grape highlight */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-game-grape-light/60 rounded-full blur-sm" />
      
      {/* Grape stem */}
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-secondary/80 rounded-full" />
    </div>
  );
});

Grape.displayName = 'Grape';

export default Grape;