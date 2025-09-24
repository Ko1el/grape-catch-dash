import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BasketProps {
  x: number;
  className?: string;
}

const Basket = forwardRef<HTMLDivElement, BasketProps>(({ x, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute bottom-4 w-16 h-8 bg-game-basket rounded-b-full border-2 border-game-basket transition-all duration-150 ease-out",
        "shadow-lg shadow-game-basket/30",
        className
      )}
      style={{
        left: `${x}px`,
        transform: 'translateX(-50%)',
      }}
    >
      {/* Basket handle */}
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-game-basket rounded-full border border-foreground/20" />
      
      {/* Basket rim */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-game-basket/80 via-foreground/20 to-game-basket/80 rounded-full" />
    </div>
  );
});

Basket.displayName = 'Basket';

export default Basket;