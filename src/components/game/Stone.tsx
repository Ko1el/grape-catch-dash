import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface StoneProps {
  x: number;
  y: number;
  speed: number;
  className?: string;
}

const Stone = forwardRef<HTMLDivElement, StoneProps>(({ x, y, speed, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute w-5 h-5 bg-gradient-to-br from-game-stone to-game-stone/70 rounded-sm",
        "shadow-lg shadow-game-stone/50 border border-game-stone/50",
        "animate-fall-fast",
        className
      )}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translateX(-50%) rotate(45deg)',
        animationDuration: `${3 / speed}s`,
      }}
    >
      {/* Stone texture */}
      <div className="absolute inset-1 bg-game-stone/30 rounded-sm" />
      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-foreground/20 rounded-full" />
      <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-foreground/30 rounded-full" />
    </div>
  );
});

Stone.displayName = 'Stone';

export default Stone;