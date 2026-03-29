import React, { useRef, useEffect, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import Leaderboard from '../Leaderboard';

// 0: dot, 1: wall, 2: empty
const MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,1,2,1,2,1,1,0,1,1,1,1],
  [2,2,2,1,0,1,2,2,2,2,2,1,0,1,2,2,2],
  [1,1,1,1,0,1,2,1,2,1,2,1,0,1,1,1,1],
  [2,2,2,2,0,2,2,1,2,1,2,2,0,2,2,2,2],
  [1,1,1,1,0,1,2,1,1,1,2,1,0,1,1,1,1],
  [2,2,2,1,0,1,2,2,2,2,2,1,0,1,2,2,2],
  [1,1,1,1,0,1,2,1,1,1,2,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0,1],
  [1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1],
  [1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const TILE_SIZE = 20;
const CANVAS_WIDTH = MAP[0].length * TILE_SIZE;
const CANVAS_HEIGHT = MAP.length * TILE_SIZE;

export default function PacmanGame() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let grid = JSON.parse(JSON.stringify(MAP));
    
    // Pacman fix: Start at row 15 (index 15) to avoid spanning inside a wall block
    let pac = { x: 8 * TILE_SIZE + TILE_SIZE/2, y: 15 * TILE_SIZE + TILE_SIZE/2, radius: 5, renderRadius: 6, speed: 1.5, dx: 0, dy: 0, nextDx: 0, nextDy: 0, mouthOpen: 0, mouthDir: 1 };
    
    // Ghosts
    let ghosts = [
      { x: 8 * TILE_SIZE + TILE_SIZE/2, y: 7 * TILE_SIZE + TILE_SIZE/2, color: '#ef4444', dx: -1, dy: 0, speed: 0.8, lastTurnX: -1, lastTurnY: -1 },
      { x: 8 * TILE_SIZE + TILE_SIZE/2, y: 9 * TILE_SIZE + TILE_SIZE/2, color: '#3b82f6', dx: 1, dy: 0, speed: 0.8, lastTurnX: -1, lastTurnY: -1 },
    ];

    let currentScore = 0;
    let totalDots = grid.flat().filter(id => id === 0).length;

    const keyDownHandler = (e) => {
      e.preventDefault();
      if (e.key === 'ArrowUp') { pac.nextDx = 0; pac.nextDy = -pac.speed; }
      if (e.key === 'ArrowDown') { pac.nextDx = 0; pac.nextDy = pac.speed; }
      if (e.key === 'ArrowLeft') { pac.nextDx = -pac.speed; pac.nextDy = 0; }
      if (e.key === 'ArrowRight') { pac.nextDx = pac.speed; pac.nextDy = 0; }
    };

    window.addEventListener('keydown', keyDownHandler, { passive: false });

    // Physics helpers
    const getTile = (x, y) => {
      const col = Math.floor(x / TILE_SIZE);
      const row = Math.floor(y / TILE_SIZE);
      if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
        return { val: grid[row][col], row, col };
      }
      return { val: 1, row: -1, col: -1 }; // Wall if out of bounds
    };

    const isWall = (x, y, radius) => {
      // Check the 4 corners of the bounding box
      return getTile(x - radius + 1, y - radius + 1).val === 1 ||
             getTile(x + radius - 1, y - radius + 1).val === 1 ||
             getTile(x - radius + 1, y + radius - 1).val === 1 ||
             getTile(x + radius - 1, y + radius - 1).val === 1;
    };

    const drawMap = () => {
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          const val = grid[row][col];
          const x = col * TILE_SIZE;
          const y = row * TILE_SIZE;
          
          if (val === 1) { // Wall
            ctx.fillStyle = '#1e3a8a';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#3b82f6';
            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
          } else if (val === 0) { // Dot
            ctx.beginPath();
            ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#fef08a';
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const drawPacman = () => {
      ctx.save();
      ctx.translate(pac.x, pac.y);
      
      // Rotate based on direction
      if (pac.dx > 0) ctx.rotate(0);
      else if (pac.dx < 0) ctx.rotate(Math.PI);
      else if (pac.dy > 0) ctx.rotate(Math.PI / 2);
      else if (pac.dy < 0) ctx.rotate(-Math.PI / 2);

      // Animate mouth
      pac.mouthOpen += 0.05 * pac.mouthDir;
      if (pac.mouthOpen >= 0.25 || pac.mouthOpen <= 0) pac.mouthDir *= -1;

      ctx.beginPath();
      ctx.arc(0, 0, pac.renderRadius, pac.mouthOpen * Math.PI, (2 - pac.mouthOpen) * Math.PI);
      ctx.lineTo(0,0);
      ctx.fillStyle = '#facc15';
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };

    const drawGhosts = () => {
      ghosts.forEach(g => {
        ctx.beginPath();
        ctx.arc(g.x, g.y, pac.renderRadius, Math.PI, 0);
        ctx.lineTo(g.x + pac.renderRadius, g.y + pac.renderRadius);
        ctx.lineTo(g.x - pac.renderRadius, g.y + pac.renderRadius);
        ctx.fillStyle = g.color;
        ctx.fill();
        ctx.closePath();
      });
    };

    const update = () => {
      if (!isPlaying || gameOver || win) return;

      // Try applying next direction if perfectly aligned or roughly aligned
      const isAlignedX = pac.x % TILE_SIZE === TILE_SIZE/2;
      const isAlignedY = pac.y % TILE_SIZE === TILE_SIZE/2;

      // Allow turns if we won't hit a wall
      if (pac.nextDx !== 0 || pac.nextDy !== 0) {
        if (!isWall(pac.x + pac.nextDx, pac.y + pac.nextDy, pac.radius)) {
          // Snap strictly to grid to prevent getting stuck
          if (pac.nextDx !== 0) pac.y = Math.floor(pac.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE/2;
          if (pac.nextDy !== 0) pac.x = Math.floor(pac.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE/2;
          
          pac.dx = pac.nextDx;
          pac.dy = pac.nextDy;
          pac.nextDx = 0;
          pac.nextDy = 0;
        }
      }

      // Move pacman if no wall
      if (!isWall(pac.x + pac.dx, pac.y + pac.dy, pac.radius)) {
        pac.x += pac.dx;
        pac.y += pac.dy;
      }

      // Screen wrapping
      if (pac.x < 0) pac.x = CANVAS_WIDTH;
      if (pac.x > CANVAS_WIDTH) pac.x = 0;

      // Eat dots
      const tile = getTile(pac.x, pac.y);
      if (tile.val === 0) {
        grid[tile.row][tile.col] = 2; // Empty
        currentScore += 10;
        totalDots -= 1;
        setScore(currentScore);
        if (totalDots <= 0) {
          setWin(true);
          setIsPlaying(false);
        }
      }

      // Move ghosts simple logic
      ghosts.forEach(g => {
        const cx = Math.floor(g.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE/2;
        const cy = Math.floor(g.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE/2;

        // Floating point tolerance check (distance to center <= half step speed)
        if (Math.abs(g.x - cx) <= g.speed / 2 && Math.abs(g.y - cy) <= g.speed / 2 && (g.lastTurnX !== cx || g.lastTurnY !== cy)) {
          g.x = cx; // Snapping to exact grid center
          g.y = cy;
          g.lastTurnX = cx;
          g.lastTurnY = cy;

          const dirs = [
            {dx: g.speed, dy: 0}, {dx: -g.speed, dy: 0},
            {dx: 0, dy: g.speed}, {dx: 0, dy: -g.speed}
          ];

          // Check if adjacent entire tile block is a wall
          let valid = dirs.filter(d => {
            const checkX = cx + Math.sign(d.dx) * TILE_SIZE;
            const checkY = cy + Math.sign(d.dy) * TILE_SIZE;
            return getTile(checkX, checkY).val !== 1; 
          });

          // Prevent immediate 180 reversals unless trapped
          let validForward = valid.filter(d => d.dx !== -g.dx || d.dy !== -g.dy);
          
          if (validForward.length > 0) {
            const picked = validForward[Math.floor(Math.random() * validForward.length)];
            g.dx = picked.dx;
            g.dy = picked.dy;
          } else if (valid.length > 0) {
            g.dx = valid[0].dx;
            g.dy = valid[0].dy;
          } else {
            g.dx = 0;
            g.dy = 0;
          }
        }
        g.x += g.dx;
        g.y += g.dy;

        // Strict boundary wrap to prevent ghosts from leaving screen
        if (g.x < 0) g.x = CANVAS_WIDTH;
        if (g.x > CANVAS_WIDTH) g.x = 0;

        // Collision 
        const dist = Math.hypot(g.x - pac.x, g.y - pac.y);
        if (dist < pac.radius * 2) {
          setGameOver(true);
          setIsPlaying(false);
        }
      });

      // Render
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawMap();
      drawPacman();
      drawGhosts();

      animationId = requestAnimationFrame(update);
    };

    if (isPlaying && !gameOver && !win) {
      update();
    } else {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawMap();
      drawPacman();
      drawGhosts();
    }

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, gameOver, win]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 800);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      setScore(0);
      setGameOver(false);
      setWin(false);
      setIsPlaying(true);
    }
  }, [countdown]);

  const initiateStart = () => {
    setCountdown(3);
  };

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setWin(false);
    setIsPlaying(true);
  };

  return (
    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Packet Sniffer</h3>
        <div style={{ color: '#facc15', fontWeight: 'bold', fontSize: '1.2rem' }}>Score: {score}</div>
      </div>

      <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--glass-border)' }}>
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ background: '#020617', display: 'block' }} />
        
        {!isPlaying && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1rem', zIndex: 10
          }}>
            {countdown !== null ? (
              <h3 style={{ color: '#fbbf24', fontSize: '4rem', margin: 0 }}>{countdown > 0 ? countdown : 'GO!'}</h3>
            ) : (
              <>
                {gameOver && <h3 style={{ color: '#ef4444', fontSize: '2rem', margin: 0 }}>CAUGHT!</h3>}
                {win && <h3 style={{ color: '#10b981', fontSize: '2rem', margin: 0 }}>NETWORK CLEARED!</h3>}
                
                {gameOver || win ? (
                  <button onClick={initiateStart} className="btn btn-primary" style={{ zIndex: 20 }}>
                    <Play size={18}/> Play Again
                  </button>
                ) : (
                  <>
                    <button onClick={initiateStart} className="btn btn-primary" style={{ zIndex: 20 }}>
                      <Play size={18}/> Start Packet Sniffing
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
        <Leaderboard gameId="pacman" currentScore={(gameOver || win) ? score : 0} onRestart={null} />
      </div>
    </div>
  );
}
