import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Heart, Play } from 'lucide-react';

interface UIOverlayProps {
  gameStarted: boolean;
  gameOver: boolean;
  score: number;
  lives: number;
  onStart: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gameStarted, gameOver, score, lives, onStart }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col z-40">
      {/* HUD */}
      <div className="p-6 flex justify-between items-start w-full text-white font-bold drop-shadow-md">
        <div className="flex items-center gap-2 bg-slate-800/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
          <Trophy size={20} className="text-yellow-400" />
          <span className="text-xl tracking-wider uppercase font-mono">{score}</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-800/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
          {[...Array(3)].map((_, i) => (
            <Heart 
              key={i} 
              size={20} 
              className={i < lives ? "fill-red-500 text-red-500" : "text-slate-500 opacity-30"} 
            />
          ))}
        </div>
      </div>

      {/* Menus */}
      <AnimatePresence>
        {!gameStarted && !gameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center pointer-events-auto bg-slate-950/60 backdrop-blur-sm"
          >
            <h1 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter">
              ETHIOFOOD<br/>CATCHER
            </h1>
            <p className="text-slate-300 mb-8 max-w-xs leading-relaxed">
              Catch the falling blue icons to score points. Don't let them hit the floor!
            </p>
            <button 
              onClick={onStart}
              className="group flex items-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-full font-bold text-xl hover:bg-slate-200 transition-all transform active:scale-95 shadow-xl"
            >
              <Play fill="currentColor" />
              START GAME
            </button>
          </motion.div>
        )}

        {gameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center pointer-events-auto bg-red-950/80 backdrop-blur-md"
          >
            <h2 className="text-6xl font-black mb-2 text-white">GAME OVER</h2>
            <div className="bg-white/10 p-6 rounded-2xl mb-8 border border-white/20">
              <p className="text-slate-300 uppercase tracking-widest text-sm mb-1">Final Score</p>
              <p className="text-6xl font-black text-white">{score}</p>
            </div>
            <button 
              onClick={onStart}
              className="bg-white text-red-950 px-10 py-4 rounded-full font-bold text-xl hover:bg-slate-100 transition-all transform active:scale-95 shadow-2xl"
            >
              TRY AGAIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UIOverlay;