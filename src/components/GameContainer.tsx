import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../scenes/MainScene';

interface GameContainerProps {
  gameStarted: boolean;
  gameOver: boolean;
  onScoreUpdate: (score: number) => void;
  onLifeUpdate: (lives: number) => void;
  onGameOver: (score: number) => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ 
  gameStarted, 
  gameOver, 
  onScoreUpdate, 
  onLifeUpdate, 
  onGameOver 
}) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 600,
      height: 800,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: [MainScene],
      backgroundColor: '#0f172a',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Listen for events from the scene
    game.events.on('score-changed', (s: number) => onScoreUpdate(s));
    game.events.on('lives-changed', (l: number) => onLifeUpdate(l));
    game.events.on('game-over', (s: number) => onGameOver(s));

    return () => {
      game.destroy(true);
    };
  }, []);

  useEffect(() => {
    if (gameRef.current) {
      const scene = gameRef.current.scene.getScene('MainScene') as MainScene;
      if (scene) {
        if (gameStarted && !gameOver) {
          scene.startGame();
        } else if (gameOver) {
          scene.stopGame();
        }
      }
    }
  }, [gameStarted, gameOver]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default GameContainer;