import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import Leaderboard from '../Leaderboard';

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 500;
const CAR_WIDTH = 30;
const CAR_HEIGHT = 50;

export default function CarGame() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let player = { x: CANVAS_WIDTH / 2 - CAR_WIDTH / 2, y: CANVAS_HEIGHT - CAR_HEIGHT - 20, speed: 4 };
    let obstacles = [];
    let keys = { ArrowLeft: false, ArrowRight: false };
    let currentScore = 0;
    let frames = 0;
    let gameSpeed = 3;

    const handleKeyDown = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        keys[e.key] = true;
      }
    };
    
    const handleKeyUp = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        keys[e.key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);

    const drawBorder = () => {
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, 10, CANVAS_HEIGHT);
      ctx.fillRect(CANVAS_WIDTH - 10, 0, 10, CANVAS_HEIGHT);
      
      // Moving lane markers
      ctx.fillStyle = '#94a3b8';
      for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
        let laneY = (i + frames * gameSpeed) % CANVAS_HEIGHT;
        ctx.fillRect(CANVAS_WIDTH / 3, laneY, 4, 20);
        ctx.fillRect((CANVAS_WIDTH / 3) * 2, laneY, 4, 20);
      }
    };

    const drawCar = (x, y, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, CAR_WIDTH, CAR_HEIGHT);
      ctx.fillStyle = '#0f172a';
      // windshield
      ctx.fillRect(x + 4, y + 10, CAR_WIDTH - 8, 12);
      ctx.fillRect(x + 4, y + CAR_HEIGHT - 15, CAR_WIDTH - 8, 8);
    };

    const update = () => {
      if (!isPlaying || gameOver) return;
      frames++;

      // Move player
      if (keys.ArrowLeft && player.x > 10) player.x -= player.speed;
      if (keys.ArrowRight && player.x < CANVAS_WIDTH - 10 - CAR_WIDTH) player.x += player.speed;
      if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
      if (keys.ArrowDown && player.y < CANVAS_HEIGHT - CAR_HEIGHT) player.y += player.speed;

      // Spawn obstacles
      if (frames % Math.max(30, 90 - Math.floor(currentScore / 50)) === 0) {
        let lanes = [25, CANVAS_WIDTH/3 + 15, (CANVAS_WIDTH/3)*2 + 5];
        let lane = lanes[Math.floor(Math.random() * lanes.length)];
        obstacles.push({ x: lane, y: -CAR_HEIGHT, color: '#ef4444' });
      }

      // Move obstacles & collision
      for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.y += gameSpeed;

        if (
          player.x < obs.x + CAR_WIDTH &&
          player.x + CAR_WIDTH > obs.x &&
          player.y < obs.y + CAR_HEIGHT &&
          player.y + CAR_HEIGHT > obs.y
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return;
        }
      }

      // Remove passed obstacles & increase score
      obstacles = obstacles.filter(obs => {
        if (obs.y > CANVAS_HEIGHT) {
          currentScore += 10;
          setScore(currentScore);
          if (currentScore % 100 === 0) gameSpeed += 0.5;
          return false;
        }
        return true;
      });

      // Render
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawBorder();
      drawCar(player.x, player.y, '#3b82f6'); // Player car
      obstacles.forEach(obs => drawCar(obs.x, obs.y, obs.color));

      animationId = requestAnimationFrame(update);
    };

    if (isPlaying && !gameOver) {
      update();
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawBorder();
      drawCar(player.x, player.y, '#3b82f6');
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 800);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      setScore(0);
      setGameOver(false);
      setIsPlaying(true);
    }
  }, [countdown]);

  const initiateStart = () => setCountdown(3);

  return (
    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Retro Racer</h3>
        <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.2rem' }}>Score: {score}</div>
      </div>

      <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--glass-border)' }}>
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ display: 'block' }} />
        
        {!isPlaying && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1rem', zIndex: 10
          }}>
            {countdown !== null ? (
              <h3 style={{ color: '#fbbf24', fontSize: '4rem', margin: 0 }}>{countdown > 0 ? countdown : 'GO!'}</h3>
            ) : (
              <>
                {gameOver && <h3 style={{ color: '#ef4444', fontSize: '2rem', margin: 0 }}>CRASHED!</h3>}
                <button onClick={initiateStart} className="btn btn-primary" style={{ zIndex: 20 }}>
                  <Play size={18}/> {gameOver ? 'Race Again' : 'Start Engine'}
                </button>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Left/Right arrows to steer</p>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <Leaderboard gameId="car" currentScore={gameOver ? score : 0} onRestart={null} />
      </div>
    </div>
  );
}
