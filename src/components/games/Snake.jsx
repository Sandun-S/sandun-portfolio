import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import Leaderboard from '../Leaderboard';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIR = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [dir, setDir] = useState(INITIAL_DIR);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [countdown, setCountdown] = useState(null);

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver) return;

    setSnake(prev => {
      const head = { ...prev[0] };
      head.x += dir.x;
      head.y += dir.y;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        if (score > highScore) setHighScore(score);
        return prev;
      }

      // Self collision
      if (prev.some(seg => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        if (score > highScore) setHighScore(score);
        return prev;
      }

      const newSnake = [head, ...prev];

      // Eat food
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [dir, isPlaying, gameOver, food, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      switch (e.key) {
        case 'ArrowUp': if (dir.y !== 1) setDir({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (dir.y !== -1) setDir({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (dir.x !== 1) setDir({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (dir.x !== -1) setDir({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const initiateStart = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 800);
      return () => clearTimeout(timer);
    } else {
      startGame();
      setCountdown(null);
    }
  }, [countdown]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDir(INITIAL_DIR);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setFood({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    });
  };

  return (
    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Classic Snake</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>Score: {score}</span>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Trophy size={16}/> {highScore}</span>
        </div>
      </div>

      <div style={{ 
        width: '100%', maxWidth: '400px', aspectRatio: '1', margin: '0 auto', 
        background: 'rgba(0,0,0,0.3)', border: '2px solid var(--glass-border)', 
        position: 'relative', borderRadius: '8px', overflow: 'hidden'
      }}>
        {/* Render Snake */}
        {snake.map((seg, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`,
            left: `${(seg.x * 100) / GRID_SIZE}%`, top: `${(seg.y * 100) / GRID_SIZE}%`,
            background: i === 0 ? '#10b981' : '#34d399',
            borderRadius: i === 0 ? '4px' : '2px',
            border: '1px solid rgba(0,0,0,0.1)'
          }} />
        ))}
        {/* Render Food */}
        <div style={{
          position: 'absolute',
          width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`,
          left: `${(food.x * 100) / GRID_SIZE}%`, top: `${(food.y * 100) / GRID_SIZE}%`,
          background: '#ef4444', borderRadius: '50%',
          boxShadow: '0 0 10px #ef4444'
        }} />

        {!isPlaying && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1rem', zIndex: 10
          }}>
            {countdown !== null ? (
              <h3 style={{ color: '#fbbf24', fontSize: '4rem', margin: 0 }}>{countdown > 0 ? countdown : 'GO!'}</h3>
            ) : (
              <>
                {gameOver && <h3 style={{ color: '#ef4444', fontSize: '2rem', margin: 0 }}>GAME OVER</h3>}
                
                {gameOver ? (
                  <button onClick={initiateStart} className="btn btn-primary" style={{ zIndex: 20 }}>
                    <RotateCcw size={18}/> Play Again
                  </button>
                ) : (
                  <>
                    <button onClick={initiateStart} className="btn btn-primary" style={{ zIndex: 20 }}>
                      <Play size={18}/> Start Game
                    </button>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Use arrow keys to move</p>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <Leaderboard gameId="snake" currentScore={gameOver ? score : 0} onRestart={null} />
      </div>
    </div>
  );
}
