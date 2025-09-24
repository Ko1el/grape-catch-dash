import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface HUDProps {
  grapesCaught: number;
  grapesToWin: number;
  className?: string;
}

const HUD = ({ grapesCaught, grapesToWin, className }: HUDProps) => {
  const progress = (grapesCaught / grapesToWin) * 100;
  
  return (
    <Card className={cn("p-4 bg-card/80 backdrop-blur-sm border-border/50", className)}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-foreground">Zebrane Winogrona</h2>
        <span className="text-2xl font-bold text-game-grape">
          {grapesCaught}/{grapesToWin}
        </span>
      </div>
      
      <Progress 
        value={progress} 
        className="h-3 bg-muted" 
      />
      
      <div className="mt-2 text-xs text-muted-foreground text-center">
        Pozostało {grapesToWin - grapesCaught} winogron
      </div>
    </Card>
  );
};

export default HUD;