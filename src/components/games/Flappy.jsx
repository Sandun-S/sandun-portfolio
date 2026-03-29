import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import Leaderboard from '../Leaderboard';

const GRAVITY = 0.35;
const JUMP = -6;
const PIPE_SPEED = 2;
const PIPE_WIDTH = 60;
const PIPE_GAP = 220;
const BIRD_SIZE = 28;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;

export default function Flappy() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(null);
  
  const birdY = useRef(250);
  const birdVelocity = useRef(0);
  const pipes = useRef([]);
  const frameId = useRef(null);

  const jump = () => {
    if (!isPlaying && !gameOver) {
      setIsPlaying(true);
    }
    if (isPlaying && !gameOver) {
      birdVelocity.current = JUMP;
    }
  };

  const gameLoop = () => {
    if (!isPlaying || gameOver) return;

    // Apply gravity
    birdVelocity.current += GRAVITY;
    birdY.current += birdVelocity.current;

    // Move pipes
    pipes.current.forEach(p => {
      p.x -= PIPE_SPEED;
    });

    // Spawn pipes
    if (pipes.current.length === 0 || pipes.current[pipes.current.length - 1].x < GAME_WIDTH - 200) {
      const minGapY = 50;
      const maxGapY = GAME_HEIGHT - minGapY - PIPE_GAP;
      const gapY = Math.floor(Math.random() * (maxGapY - minGapY + 1)) + minGapY;
      pipes.current.push({ x: GAME_WIDTH, gapY, passed: false });
    }

    // Remove off-screen pipes
    if (pipes.current[0] && pipes.current[0].x < -PIPE_WIDTH) {
      pipes.current.shift();
    }

    // Collision Detection
    const by = birdY.current;
    
    // Floor/Ceiling
    if (by <= 0 || by + BIRD_SIZE >= GAME_HEIGHT) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    // Pipes
    const p = pipes.current[0];
    if (p && p.x < BIRD_SIZE && p.x + PIPE_WIDTH > 0) {
      if (by < p.gapY || by + BIRD_SIZE > p.gapY + PIPE_GAP) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }
    }

    // Score
    if (p && !p.passed && p.x + PIPE_WIDTH < 0) {
      p.passed = true;
      setScore(s => s + 1);
    }

    frameId.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (isPlaying && !gameOver) {
      frameId.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(frameId.current);
  }, [isPlaying, gameOver]);

  // Handle Controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 800);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      startGame();
    }
  }, [countdown]);

  const initiateStart = () => {
    setCountdown(3);
  };

  const startGame = () => {
    birdY.current = 250;
    birdVelocity.current = JUMP / 2; // slight float up on start to prevent sudden drop
    pipes.current = [{ x: GAME_WIDTH + 200, gapY: 150, passed: false }]; // start first pipe far away
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Drone Flyer</h3>
        <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>Score: {score}</div>
      </div>

      <div 
        onClick={jump}
        style={{ 
          position: 'relative', width: '100%', maxWidth: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px`, margin: '0 auto', 
          background: 'linear-gradient(to bottom, #0ea5e950, #020617)', border: '2px solid var(--glass-border)', 
          borderRadius: '8px', overflow: 'hidden', cursor: 'pointer'
        }}
      >
        {/* Bird (Drone) */}
        <div style={{
          position: 'absolute', width: BIRD_SIZE, height: BIRD_SIZE,
          left: '20px', top: birdY.current,
          background: '#f59e0b', borderRadius: '50%',
          boxShadow: '0 0 10px #f59e0b',
          transform: `rotate(${Math.min(Math.max(birdVelocity.current * 3, -30), 90)}deg)`,
          transition: 'transform 0.1s'
        }} />

        {/* Pipes */}
        {pipes.current.map((p, i) => (
          <React.Fragment key={i}>
            {/* Top Pipe */}
            <div style={{ position: 'absolute', left: p.x, top: 0, width: PIPE_WIDTH, height: p.gapY, background: '#10b981', border: '2px solid #047857' }} />
            {/* Bottom Pipe */}
            <div style={{ position: 'absolute', left: p.x, top: p.gapY + PIPE_GAP, width: PIPE_WIDTH, height: GAME_HEIGHT - p.gapY - PIPE_GAP, background: '#10b981', border: '2px solid #047857' }} />
          </React.Fragment>
        ))}

        {!isPlaying && (
           <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1rem', zIndex: 10
          }}>
            {countdown !== null ? (
              <h3 style={{ color: '#fbbf24', fontSize: '4rem', margin: 0 }}>{countdown > 0 ? countdown : 'FLY!'}</h3>
            ) : (
              <>
                {gameOver && <h3 style={{ color: '#ef4444', fontSize: '2rem', margin: 0 }}>CRASHED!</h3>}
                
                {gameOver ? (
                  <button onClick={initiateStart} className="btn btn-primary" style={{ zIndex: 20 }}>
                    <RotateCcw size={18}/> Re-launch
                  </button>
                ) : (
                  <button onClick={initiateStart} className="btn btn-primary" style={{ zIndex: 20 }}>
                    <Play size={18}/> Start Engine
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <Leaderboard gameId="flappy" currentScore={gameOver ? score : 0} onRestart={null} />
      </div>
    </div>
  );
}
