import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import Leaderboard from '../Leaderboard';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 150;
const FLOOR = 130;
const GRAVITY = 0.6;
const JUMP = -10.5;

// Chrome Dino Pixel Art (ASCII mapped to Canvas pixel blocks)
const DINO_STAND = [
  "             ........",
  "            .........",
  "            ... .....",
  "            .........",
  "            .........",
  "            ....     ",
  "            .......  ",
  "       .... .......  ",
  "      .............  ",
  "....... ...........  ",
  "...................  ",
  " ..................  ",
  "  .................  ",
  "    ..............   ",
  "     ...........     ",
  "      .........      ",
  "       .......       ",
  "        .....        ",
  "        .. ..        ",
  "        .. ..        ",
  "       ... ..        "
];

const DINO_RUN_1 = [
  "             ........",
  "            .........",
  "            ... .....",
  "            .........",
  "            .........",
  "            ....     ",
  "            .......  ",
  "       .... .......  ",
  "      .............  ",
  "....... ...........  ",
  "...................  ",
  " ..................  ",
  "  .................  ",
  "    ..............   ",
  "     ...........     ",
  "      .........      ",
  "       .......       ",
  "        .....        ",
  "        ..           ",
  "        ..           ",
  "       ...           "
];

const DINO_RUN_2 = [
  "             ........",
  "            .........",
  "            ... .....",
  "            .........",
  "            .........",
  "            ....     ",
  "            .......  ",
  "       .... .......  ",
  "      .............  ",
  "....... ...........  ",
  "...................  ",
  " ..................  ",
  "  .................  ",
  "    ..............   ",
  "     ...........     ",
  "      .........      ",
  "       .......       ",
  "        .....        ",
  "           ..        ",
  "           ..        ",
  "          ...        "
];

const DINO_DUCK_1 = [
  "                                     ",
  "                                     ",
  "                                     ",
  "                                     ",
  "                                     ",
  "                                     ",
  "                                     ",
  "                      ........       ",
  "                 .... .........      ",
  "       ....     ..... ... .....      ",
  "      .......  ...... .........      ",
  "....... .......................      ",
  "...............................      ",
  " ..............................      ",
  "  ..........................         ",
  "   .......................           ",
  "      ..................             ",
  "       .......      ..               ",
  "        .....       ..               ",
  "        ..         ...               ",
  "       ...                           "
];

const DINO_DUCK_2 = [
  "                                     ",
  "                                     ",
  "                                     ",
  "                                     ",
  "                                     ",
  "                                     ",
  "                                     ",
  "                      ........       ",
  "                 .... .........      ",
  "       ....     ..... ... .....      ",
  "      .......  ...... .........      ",
  "....... .......................      ",
  "...............................      ",
  " ..............................      ",
  "  ..........................         ",
  "   .......................           ",
  "      ..................             ",
  "       .......         ..            ",
  "        .....          ..            ",
  "          ...         ...            ",
  "                                     "
];


const CACTUS_1 = [
  "    ..    ",
  "    ..    ",
  " .. ..    ",
  "... .. .. ",
  "... .. ...",
  "...... ...",
  " ..... ...",
  "  ....... ",
  "    ..    ",
  "    ..    ",
  "    ..    ",
  "    ..    "
];

const CACTUS_2 = [
  "   ..       ..    ",
  "   ..       ..    ",
  "   ..    .. ..    ",
  ".. ...... ..... ..",
  "......... ........",
  "......... ........",
  "......... ........",
  " .... ....... ....",
  "   ..    ..   ..  ",
  "   ..    ..   ..  ",
  "   ..    ..   ..  ",
  "   ..    ..   ..  "
];

const BIRD_1 = [
  "      ..        ",
  "     .....      ",
  "   .........    ",
  " ......  ....   ",
  " ...... ....... ",
  "   ....  ....   ",
  "         .      ",
  "                "
];

const BIRD_2 = [
  "                ",
  "                ",
  "       ..       ",
  "     .......    ",
  " ...... ....... ",
  "   ....  ....   ",
  "   ...   .      ",
  "   .            "
];

// Helper to draw pixel art arrays
const drawArt = (ctx, art, x, y, scale = 2) => {
  ctx.fillStyle = '#535353'; // Classic Chrome Offline Dino Color
  for (let i = 0; i < art.length; i++) {
    for (let j = 0; j < art[i].length; j++) {
      if (art[i][j] !== ' ') {
        ctx.fillRect(x + j * scale, y + i * scale, scale, scale);
      }
    }
  }
};

export default function DinoGame() {
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
    let dino = { x: 50, y: FLOOR - 42, dy: 0, isJumping: false, ducking: false };
    let obstacles = [];
    let currentScore = 0;
    let frames = 0;
    let gameSpeed = 5;
    let cloudParticles = Array.from({length: 3}).map(() => ({ x: Math.random() * CANVAS_WIDTH, y: 30 + Math.random() * 40, speed: Math.random() * 0.5 + 0.2 }));
    let groundDust = Array.from({length: 30}).map(() => ({ x: Math.random() * CANVAS_WIDTH, y: FLOOR + Math.random() * 15, w: Math.random() * 3 + 1 }));

    const handleKeyDown = (e) => {
      // Space or up arrow
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !dino.isJumping) {
        e.preventDefault();
        dino.dy = JUMP;
        dino.isJumping = true;
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        dino.ducking = true;
        if (dino.isJumping) dino.dy += 2; // Fast fall
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowDown') {
        dino.ducking = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);

    const update = () => {
      if (!isPlaying || gameOver) return;
      frames++;

      // Gravity
      dino.dy += GRAVITY;
      dino.y += dino.dy;

      if (dino.y >= FLOOR - 42) {
        dino.y = FLOOR - 42;
        dino.dy = 0;
        dino.isJumping = false;
      }

      // Modify game speed
      if (frames % 100 === 0) gameSpeed += 0.05;

      // Score
      if (frames % 5 === 0) {
        currentScore++;
        setScore(currentScore);
      }

      // Spawn Obstacles
      if (frames % Math.max(40, Math.floor(120 - gameSpeed * 3)) === 0 && Math.random() > 0.3) {
        const isBird = Math.random() > 0.8 && currentScore > 300;
        if (isBird) {
          obstacles.push({ x: CANVAS_WIDTH, y: FLOOR - 60 - (Math.random() > 0.5 ? 20 : 0), type: 'bird' });
        } else {
          obstacles.push({ x: CANVAS_WIDTH, y: FLOOR - 24, type: Math.random() > 0.5 ? 'cactus1' : 'cactus2' });
        }
      }

      // Render Background
      ctx.fillStyle = '#f7f7f7'; // Almost white background
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Clouds
      ctx.fillStyle = '#e2e8f0';
      cloudParticles.forEach(c => {
        c.x -= c.speed;
        if (c.x < -40) c.x = CANVAS_WIDTH;
        ctx.fillRect(c.x, c.y, 30, 10);
        ctx.fillRect(c.x + 5, c.y - 5, 20, 5);
      });

      // Ground line
      ctx.fillStyle = '#535353';
      ctx.fillRect(0, FLOOR, CANVAS_WIDTH, 1);
      
      // Ground dust
      groundDust.forEach(g => {
        g.x -= gameSpeed;
        if (g.x < 0) g.x = CANVAS_WIDTH;
        ctx.fillRect(g.x, g.y, g.w, 1);
      });

      // Move & Draw Obstacles
      for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;

        let obsArt = CACTUS_1;
        let obsW = 20, obsH = 24;
        
        if (obs.type === 'cactus2') { obsArt = CACTUS_2; obsW = 36; }
        if (obs.type === 'bird') { 
          obsArt = Math.floor(frames / 15) % 2 === 0 ? BIRD_1 : BIRD_2; 
          obsW = 32; obsH = 16;
          obs.x -= 1; // Birds fly slightly faster towards dino
        }

        drawArt(ctx, obsArt, obs.x, obs.y);

        // Collision logic (Hitboxes are slightly smaller than pixel art for fairness)
        let dx = dino.x + 10;
        let dy = dino.y + (dino.ducking ? 20 : 10);
        let dw = 20;
        let dh = dino.ducking ? 18 : 30;

        if (
          dx < obs.x + obsW - 4 &&
          dx + dw > obs.x + 4 &&
          dy < obs.y + obsH - 4 &&
          dy + dh > obs.y + 4
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return;
        }
      }

      obstacles = obstacles.filter(obs => obs.x > -50);

      // Draw Dino
      let dinoArt = DINO_STAND;
      if (dino.isJumping) {
        dinoArt = DINO_STAND;
      } else if (dino.ducking) {
        dinoArt = Math.floor(frames / 6) % 2 === 0 ? DINO_DUCK_1 : DINO_DUCK_2;
      } else {
        dinoArt = Math.floor(frames / 6) % 2 === 0 ? DINO_RUN_1 : DINO_RUN_2;
      }
      
      drawArt(ctx, dinoArt, dino.x, dino.ducking ? dino.y + 4 : dino.y);

      animationId = requestAnimationFrame(update);
    };

    if (isPlaying && !gameOver) {
      update();
    } else {
      ctx.fillStyle = '#f7f7f7';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#535353';
      ctx.fillRect(0, FLOOR, CANVAS_WIDTH, 1);
      drawArt(ctx, gameOver ? DINO_STAND : DINO_STAND, dino.x, dino.y);
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
        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Offline Dino</h3>
        <div style={{ color: '#535353', fontWeight: 'bold', fontSize: '1.5rem', fontFamily: 'monospace', letterSpacing: '2px' }}>HI {score.toString().padStart(5, '0')}</div>
      </div>

      <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto', borderRadius: '8px', overflow: 'hidden', border: '5px solid #535353', background: '#f7f7f7' }}>
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ display: 'block' }} />
        
        {!isPlaying && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(247,247,247,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1rem', zIndex: 10
          }}>
            {countdown !== null ? (
              <h3 style={{ color: '#535353', fontSize: '4rem', margin: 0, fontFamily: 'monospace' }}>{countdown > 0 ? countdown : 'GO!'}</h3>
            ) : (
              <>
                {gameOver && <h3 style={{ color: '#535353', fontSize: '2rem', margin: 0, fontFamily: 'monospace' }}>GAME OVER</h3>}
                <button onClick={initiateStart} className="btn btn-primary" style={{ zIndex: 20, background: '#535353', border: 'none', color: '#fff' }}>
                  <Play size={18}/> {gameOver ? 'Restart' : 'Start Running'}
                </button>
                <p style={{ color: '#535353', fontSize: '0.9rem', fontFamily: 'monospace' }}>Space/Up to jump, Down to duck</p>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <Leaderboard gameId="dino" currentScore={gameOver ? score : 0} onRestart={null} />
      </div>
    </div>
  );
}
