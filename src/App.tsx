import React, { useState, useEffect } from 'react';
import GameContainer from './components/GameContainer';
import UIOverlay from './components/UIOverlay';
import { soundManager } from './utils/SoundManager';
import { Volume2, VolumeX } from 'lucide-react';

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('ethiofood_muted') === 'true';
  });

  useEffect(() => {
    soundManager.setMute(isMuted);
    if (gameStarted && !gameOver && !isMuted) {
      soundManager.playMusic();
    } else {
      soundManager.stopMusic();
    }
  }, [gameStarted, gameOver, isMuted]);

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    soundManager.playSFX('click');
  };

  const handleGameOver = (finalScore: number) => {
    setGameOver(true);
    setGameStarted(false);
    soundManager.playSFX('gameover');
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('ethiofood_muted', String(newMuted));
    soundManager.setMute(newMuted);
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden flex flex-col items-center justify-center font-sans text-white">
      {/* Game Viewport */}
      <div className="relative w-full max-w-2xl aspect-[9/16] md:aspect-[3/4] bg-slate-900 shadow-2xl overflow-hidden border-4 border-slate-800 rounded-lg">
        <GameContainer 
          gameStarted={gameStarted} 
          gameOver={gameOver}
          onScoreUpdate={setScore}
          onLifeUpdate={setLives}
          onGameOver={handleGameOver}
        />
        
        <UIOverlay 
          gameStarted={gameStarted}
          gameOver={gameOver}
          score={score}
          lives={lives}
          onStart={handleStartGame}
        />

        {/* Mute Toggle */}
        <button 
          onClick={toggleMute}
          className="absolute top-4 right-4 z-50 p-2 bg-slate-800/80 rounded-full hover:bg-slate-700 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      <div className="mt-4 text-slate-400 text-sm hidden md:block">
        Use Arrow Keys or Mouse to move the basket
      </div>
    </div>
  );
};

export default App;