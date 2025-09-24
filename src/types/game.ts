export interface GameConfig {
  grapesToWin: number;
  stoneFrequency: number;
  fruitSpeed: number;
  stoneSpeed: number;
  basketSpeed: number;
  penaltyOnStone: boolean;
}

export interface GameObject {
  id: string;
  x: number;
  y: number;
  type: 'grape' | 'stone';
}

export interface GameState {
  basketX: number;
  grapesCaught: number;
  grapesSpawned: number;
  gameObjects: GameObject[];
  gameStatus: 'playing' | 'won' | 'paused';
  score: number;
}

export const defaultConfig: GameConfig = {
  grapesToWin: 50,
  stoneFrequency: 5,
  fruitSpeed: 1.5,
  stoneSpeed: 2.0,
  basketSpeed: 3.5,
  penaltyOnStone: false,
};