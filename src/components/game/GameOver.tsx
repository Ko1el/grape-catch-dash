import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GameOverProps {
  grapesCaught: number;
  onRestart: () => void;
  className?: string;
}

const GameOver = ({ grapesCaught, onRestart, className }: GameOverProps) => {
  return (
    <div className={cn("fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50", className)}>
      <Card className="p-8 max-w-md mx-4 text-center bg-card border-border animate-bounce">
        <div className="mb-8">
          <div className="text-6xl mb-6 animate-pulse-success">🍇</div>
          <h1 className="text-3xl font-bold text-game-success mb-4">
            Zwycięstwo!
          </h1>
          <p className="text-lg text-foreground mb-6">
            Zebrałeś {grapesCaught} winogron!
          </p>
        </div>
        
        <div className="mb-8 p-6 bg-game-success/10 rounded-lg border border-game-success/20">
          <p className="text-sm text-muted-foreground">
            Gratulacje za ukończenie wyzwania!
          </p>
        </div>
        
        <Button 
          onClick={onRestart}
          size="lg"
          className="bg-game-basket text-background hover:bg-game-basket/90 font-bold px-8 py-3"
        >
          Zagraj Ponownie
        </Button>
      </Card>
    </div>
  );
};

export default GameOver;