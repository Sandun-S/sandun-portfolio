import React, { useRef, useEffect, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import Leaderboard from '../Leaderboard';

export default function PongGame() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Game state inside effect to use in rAF
    let animationId;
    let ball = { x: 200, y: 150, dx: 2, dy: 2, radius: 10 };
    let paddle = { w: 160, h: 14, x: 120, y: 280 };
    let rightPressed = false;
    let leftPressed = false;
    let currentScore = 0;

    const keyDownHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
    };
    const keyUpHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
    };

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#0ea5e9';
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();
      ctx.closePath();
    };

    const draw = () => {
      if (!isPlaying || gameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawPaddle();

      // Ball wall collisions
      if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) ball.dx = -ball.dx;
      if (ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;
      else if (ball.y + ball.dy > canvas.height - ball.radius - paddle.h) {
        if (ball.x > paddle.x - ball.radius && ball.x < paddle.x + paddle.w + ball.radius) {
          ball.dy = -ball.dy;
          ball.dy *= 1.01; // speed up barely
          ball.dx *= 1.01;
          currentScore += 10;
          setScore(currentScore);
        } else if (ball.y + ball.dy > canvas.height - ball.radius) {
          setGameOver(true);
          setIsPlaying(false);
          return;
        }
      }

      ball.x += ball.dx;
      ball.y += ball.dy;

      if (rightPressed && paddle.x < canvas.width - paddle.w) paddle.x += 8.5;
      else if (leftPressed && paddle.x > 0) paddle.x -= 8.5;

      animationId = requestAnimationFrame(draw);
    };

    if (isPlaying && !gameOver) {
      draw();
    }

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      setScore(0);
      setGameOver(false);
      setIsPlaying(true);
    }
  }, [countdown]);

  const initiateStart = () => {
    setCountdown(3);
  };

  return (
    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Wall Pong</h3>
        <div style={{ color: '#0ea5e9', fontWeight: 'bold', fontSize: '1.2rem' }}>Score: {score}</div>
      </div>

      <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--glass-border)' }}>
        <canvas ref={canvasRef} width={400} height={300} style={{ background: 'rgba(0,0,0,0.5)', display: 'block' }} />
        
        {!isPlaying && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)',
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
                      <Play size={18}/> Start Pong
                    </button>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Use Left/Right arrow keys to move paddle</p>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <Leaderboard gameId="pong" currentScore={gameOver ? score : 0} onRestart={null} />
      </div>
    </div>
  );
}
