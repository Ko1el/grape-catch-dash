import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { GameState, GameObject, defaultConfig } from '@/types/game';
import Basket from './Basket';
import Grape from './Grape';
import Stone from './Stone';
import HUD from './HUD';
import GameOver from './GameOver';
import { cn } from '@/lib/utils';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BASKET_WIDTH = 64;

const Game = () => {
  const [gameState, setGameState] = useState<GameState>({
    basketX: GAME_WIDTH / 2,
    grapesCaught: 0,
    grapesSpawned: 0,
    gameObjects: [],
    gameStatus: 'playing',
    score: 0,
  });

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastSpawnTimeRef = useRef<number>(0);
  const keysPressed = useRef<Set<string>>(new Set());

  // Generate unique ID for game objects
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Spawn new objects
  const spawnObject = useCallback((type: 'grape' | 'stone') => {
    const x = Math.random() * (GAME_WIDTH - 50) + 25;
    const newObject: GameObject = {
      id: generateId(),
      x,
      y: -20,
      type,
    };

    setGameState(prev => ({
      ...prev,
      gameObjects: [...prev.gameObjects, newObject],
      grapesSpawned: type === 'grape' ? prev.grapesSpawned + 1 : prev.grapesSpawned,
    }));
  }, []);

  // Check collision between basket and object
  const checkCollision = useCallback((basketX: number, objectX: number, objectY: number) => {
    const basketLeft = basketX - BASKET_WIDTH / 2;
    const basketRight = basketX + BASKET_WIDTH / 2;
    const basketTop = GAME_HEIGHT - 50;
    
    return (
      objectX >= basketLeft &&
      objectX <= basketRight &&
      objectY >= basketTop &&
      objectY <= GAME_HEIGHT
    );
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState.gameStatus !== 'playing') return;

    const currentTime = Date.now();
    
    setGameState(prev => {
      let newBasketX = prev.basketX;
      
      // Handle basket movement
      if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a')) {
        newBasketX = Math.max(BASKET_WIDTH / 2, prev.basketX - defaultConfig.basketSpeed);
      }
      if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d')) {
        newBasketX = Math.min(GAME_WIDTH - BASKET_WIDTH / 2, prev.basketX + defaultConfig.basketSpeed);
      }

      // Move objects and check collisions
      const updatedObjects: GameObject[] = [];
      let newGrapesCaught = prev.grapesCaught;
      let collisionDetected = false;

      prev.gameObjects.forEach(obj => {
        const newY = obj.y + (obj.type === 'grape' ? defaultConfig.fruitSpeed : defaultConfig.stoneSpeed);
        
        // Check collision with basket
        if (checkCollision(newBasketX, obj.x, newY)) {
          if (obj.type === 'grape') {
            newGrapesCaught++;
            collisionDetected = true;
            toast({
              title: "Grape caught! 🍇",
              description: `${newGrapesCaught}/${defaultConfig.grapesToWin} grapes collected`,
            });
          } else if (obj.type === 'stone' && defaultConfig.penaltyOnStone) {
            newGrapesCaught = Math.max(0, newGrapesCaught - 1);
            toast({
              title: "Stone hit! 🪨",
              description: "Lost a grape!",
              variant: "destructive",
            });
          }
        } else if (newY < GAME_HEIGHT + 50) {
          // Keep object if it hasn't reached the bottom
          updatedObjects.push({ ...obj, y: newY });
        }
      });

      // Check win condition
      let newGameStatus = prev.gameStatus;
      if (newGrapesCaught >= defaultConfig.grapesToWin) {
        newGameStatus = 'won';
      }

      return {
        ...prev,
        basketX: newBasketX,
        grapesCaught: newGrapesCaught,
        gameObjects: updatedObjects,
        gameStatus: newGameStatus,
        score: newGrapesCaught * 10,
      };
    });

    // Spawn logic
    if (currentTime - lastSpawnTimeRef.current > 2000) {
      if (gameState.grapesSpawned < defaultConfig.grapesToWin * 2) {
        // Spawn stone every 5 grapes
        if (gameState.grapesSpawned > 0 && gameState.grapesSpawned % defaultConfig.stoneFrequency === 0) {
          spawnObject('stone');
        } else {
          spawnObject('grape');
        }
        lastSpawnTimeRef.current = currentTime;
      }
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, spawnObject, checkCollision]);

  // Keyboard handlers
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) {
      keysPressed.current.add(e.key);
      e.preventDefault();
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current.delete(e.key);
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState({
      basketX: GAME_WIDTH / 2,
      grapesCaught: 0,
      grapesSpawned: 0,
      gameObjects: [],
      gameStatus: 'playing',
      score: 0,
    });
    lastSpawnTimeRef.current = 0;
  }, []);

  // Setup and cleanup
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop, gameState.gameStatus]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-game-bg-start to-game-bg-end p-4">
      <div className="mb-4">
        <HUD 
          grapesCaught={gameState.grapesCaught} 
          grapesToWin={defaultConfig.grapesToWin}
        />
      </div>

      <div 
        ref={gameAreaRef}
        className={cn(
          "relative border-4 border-border/30 rounded-lg overflow-hidden bg-gradient-to-b from-background/10 to-background/20",
          "shadow-2xl shadow-background/50"
        )}
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Game objects */}
        {gameState.gameObjects.map((obj) => 
          obj.type === 'grape' ? (
            <Grape
              key={obj.id}
              x={obj.x}
              y={obj.y}
              speed={defaultConfig.fruitSpeed}
            />
          ) : (
            <Stone
              key={obj.id}
              x={obj.x}
              y={obj.y}
              speed={defaultConfig.stoneSpeed}
            />
          )
        )}

        {/* Basket */}
        <Basket x={gameState.basketX} />

        {/* Instructions */}
        <div className="absolute top-4 left-4 text-sm text-foreground/60">
          Use ← → arrow keys or A/D to move
        </div>
      </div>

      {/* Game Over Screen */}
      {gameState.gameStatus === 'won' && (
        <GameOver
          grapesCaught={gameState.grapesCaught}
          onRestart={resetGame}
        />
      )}
    </div>
  );
};

export default Game;
