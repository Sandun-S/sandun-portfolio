import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import Leaderboard from '../Leaderboard';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 300;
const GRAVITY = 0.5;
const JUMP = -9;
const FLOOR = 250;
const BALL_RADIUS = 12;

export default function BounceGame() {
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
    let ball = { x: 80, y: FLOOR - BALL_RADIUS, dy: 0, speed: 0 };
    let obstacles = []; // {x, type: 'spike'|'ring', width, height, y}
    let currentScore = 0;
    let frames = 0;
    let gameSpeed = 4;
    let backgroundOffset = 0;

    const handleKeyDown = (e) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && ball.y >= FLOOR - BALL_RADIUS) {
        e.preventDefault();
        ball.dy = JUMP;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });

    const drawBackground = () => {
      // Sky
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(0, 0, CANVAS_WIDTH, FLOOR);
      
      // Ground
      ctx.fillStyle = '#166534';
      ctx.fillRect(0, FLOOR, CANVAS_WIDTH, CANVAS_HEIGHT - FLOOR);

      // Simple grid lines on ground to show movement
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 2;
      for (let i = 0; i < CANVAS_WIDTH; i += 40) {
        let lineX = (i - backgroundOffset) % CANVAS_WIDTH;
        if (lineX < 0) lineX += CANVAS_WIDTH;
        ctx.beginPath();
        ctx.moveTo(lineX, FLOOR);
        ctx.lineTo(lineX - 20, CANVAS_HEIGHT); // draw slanted lines
        ctx.stroke();
      }
    };

    const drawBall = () => {
      // Nokia Bounce ball is red with a slight highlight
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000';
      ctx.stroke();

      // Highlight
      ctx.beginPath();
      ctx.arc(ball.x - 4, ball.y - 4, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fill();
    };

    const update = () => {
      if (!isPlaying || gameOver) return;
      frames++;
      backgroundOffset += gameSpeed;

      // Gravity
      ball.dy += GRAVITY;
      ball.y += ball.dy;

      // Floor collision
      if (ball.y > FLOOR - BALL_RADIUS) {
        ball.y = FLOOR - BALL_RADIUS;
        // In original Nokia Bounce, it bounces slightly implicitly, 
        // but for endless runner style, we just rest on the floor.
        ball.dy = 0; 
      }

      // Spawn obstacles
      if (frames % Math.max(40, 90 - Math.floor(currentScore / 20)) === 0) {
        const isRing = Math.random() > 0.6; // 40% chance of ring
        if (isRing) {
          obstacles.push({
            x: CANVAS_WIDTH,
            type: 'ring',
            y: FLOOR - 60 - Math.random() * 40,
            width: 16,
            height: 16,
            collected: false
          });
        } else {
          // Spike
          obstacles.push({
            x: CANVAS_WIDTH,
            type: 'spike',
            y: FLOOR - 20,
            width: 20,
            height: 20
          });
        }
      }

      // Move & Handle Obstacles
      for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;

        if (obs.type === 'spike') {
          // simple box collision for spike
          if (
            ball.x + BALL_RADIUS > obs.x + 5 && 
            ball.x - BALL_RADIUS < obs.x + obs.width - 5 &&
            ball.y + BALL_RADIUS > obs.y + 5
          ) {
            setGameOver(true);
            setIsPlaying(false);
            return;
          }
        } else if (obs.type === 'ring' && !obs.collected) {
          // Circle intersection roughly
          let dist = Math.hypot(ball.x - (obs.x + obs.width/2), ball.y - (obs.y + obs.height/2));
          if (dist < BALL_RADIUS + obs.width/2) {
            obs.collected = true;
            currentScore += 10;
            setScore(currentScore);
            if (currentScore % 50 === 0) gameSpeed += 0.5; // speed up
          }
        }
      }

      // Remove off-screen obstacles
      obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

      // Render
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawBackground();
      
      obstacles.forEach(obs => {
        if (obs.type === 'spike') {
          ctx.beginPath();
          ctx.moveTo(obs.x, FLOOR); // bottom left
          ctx.lineTo(obs.x + obs.width / 2, obs.y); // top middle
          ctx.lineTo(obs.x + obs.width, FLOOR); // bottom right
          ctx.fillStyle = '#0f172a'; // black spikes
          ctx.fill();
        } else if (obs.type === 'ring' && !obs.collected) {
          ctx.beginPath();
          ctx.arc(obs.x + obs.width/2, obs.y + obs.height/2, obs.width/2, 0, Math.PI * 2);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 4;
          ctx.stroke();
        } else if (obs.type === 'ring' && obs.collected) {
          // render little +10 floating text
          ctx.fillStyle = '#facc15';
          ctx.font = '14px monospace';
          ctx.fillText('+10', obs.x, obs.y);
        }
      });

      drawBall();

      animationId = requestAnimationFrame(update);
    };

    if (isPlaying && !gameOver) {
      update();
    } else {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawBackground();
      drawBall();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
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
        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Nokia Bounce</h3>
        <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>Score: {score}</div>
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
                {gameOver && <h3 style={{ color: '#ef4444', fontSize: '2rem', margin: 0 }}>POP!</h3>}
                <button onClick={initiateStart} className="btn btn-primary" style={{ zIndex: 20 }}>
                  <Play size={18}/> {gameOver ? 'Bounce Again' : 'Start Bounce'}
                </button>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Press Space or Up Arrow to Jump</p>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <Leaderboard gameId="bounce" currentScore={gameOver ? score : 0} onRestart={null} />
      </div>
    </div>
  );
}
