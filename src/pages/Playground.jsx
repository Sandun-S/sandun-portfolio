import React, { useState, useEffect, useRef } from 'react';
import { Cpu, RotateCcw, Play, AlertTriangle, Zap, TerminalSquare, LayoutGrid, Gamepad2, Activity, Wind, Ghost, Car as CarIcon, Circle } from 'lucide-react';
import SnakeGame from '../components/games/Snake';
import PongGame from '../components/games/Pong';
import DinoGame from '../components/games/Dino';
import PacmanGame from '../components/games/Pacman';
import CarGame from '../components/games/Car';
import BounceGame from '../components/games/Bounce';
import Leaderboard from '../components/Leaderboard';

// --- GAME 1: Circuit Memory (Simon Says) ---
function MemoryGame() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStatus, setGameStatus] = useState('idle');
  const [score, setScore] = useState(0);
  const [activeLed, setActiveLed] = useState(null);
  
  const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

  const playSequence = async (seq) => {
    setGameStatus('watching');
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      playSound(seq[i]);
      setActiveLed(seq[i]);
      await new Promise(r => setTimeout(r, 400));
      setActiveLed(null);
    }
    setGameStatus('playing');
  };

  const nextLevel = () => {
    const nextColor = Math.floor(Math.random() * 4);
    const newSeq = [...sequence, nextColor];
    setSequence(newSeq);
    setPlayerSequence([]);
    setScore(newSeq.length - 1);
    playSequence(newSeq);
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setSequence([]);
    setPlayerSequence([]);
    const firstColor = Math.floor(Math.random() * 4);
    const newSeq = [firstColor];
    setSequence(newSeq);
    playSequence(newSeq);
  };

  const handleLedClick = (colorIdx) => {
    if (gameStatus !== 'playing') return;
    playSound(colorIdx);
    setActiveLed(colorIdx);
    setTimeout(() => setActiveLed(null), 300);

    const newPlayerSeq = [...playerSequence, colorIdx];
    setPlayerSequence(newPlayerSeq);

    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      setGameStatus('gameover');
      setIsPlaying(false);
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      setGameStatus('watching');
      setTimeout(nextLevel, 1000);
    }
  };

  const playSound = (idx) => {
    try {
      const actx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      const freqs = [329.63, 261.63, 220.00, 164.81];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqs[idx], actx.currentTime);
      gain.gain.setValueAtTime(0.5, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + 0.3);
    } catch(e) {}
  };

  return (
    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <Cpu size={24} className="text-gradient" />
          <span style={{ fontWeight: 600 }}>Memory Module</span>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '8px', color: '#10b981', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold' }}>
          SCORE: {score.toString().padStart(3, '0')}
        </div>
      </div>
      <div style={{ 
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', 
        aspectRatio: '1', maxWidth: '300px', margin: '0 auto 2rem',
        pointerEvents: gameStatus === 'playing' ? 'auto' : 'none',
        opacity: gameStatus === 'gameover' ? 0.5 : 1
      }}>
        {COLORS.map((color, idx) => (
          <button 
            key={idx}
            onClick={() => handleLedClick(idx)}
            style={{
              background: activeLed === idx ? color : `${color}40`,
              border: `4px solid ${activeLed === idx ? '#fff' : color}`,
              borderRadius: '16px',
              boxShadow: activeLed === idx ? `0 0 30px ${color}` : 'none',
              transition: 'all 0.1s ease',
              cursor: gameStatus === 'playing' ? 'pointer' : 'default',
              outline: 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
             <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '2px', background: color, opacity: 0.5, transform: 'rotate(-45deg)' }} />
             <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '20px', height: '2px', background: color, opacity: 0.5, transform: 'rotate(45deg)' }} />
          </button>
        ))}
      </div>
      <div style={{ minHeight: '60px' }}>
        {gameStatus === 'idle' && (
          <button onClick={startGame} className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>
            <Play size={18} /> Initialize Routine
          </button>
        )}
        {gameStatus === 'watching' && <p style={{ color: 'var(--accent-primary)', fontSize: '1.1rem', fontWeight: 'bold', animation: 'fadeInOut 1s infinite' }}>Observing Sequence...</p>}
        {gameStatus === 'playing' && <p style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 'bold' }}>Awaiting Input...</p>}
        {gameStatus === 'gameover' && (
          <div>
            <div style={{ color: '#ef4444', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
               <AlertTriangle size={20} /> System Fault
            </div>
            <Leaderboard gameId="memory" currentScore={score} onRestart={startGame} />
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <Leaderboard gameId="memory" currentScore={gameStatus === 'gameover' ? score : 0} onRestart={null} />
      </div>
    </div>
  );
}

// --- GAME 2: Interrupt Calibration (Reaction Test) ---
function ReactionGame() {
  const [state, setState] = useState('idle'); // idle, waiting, ready, done
  const [message, setMessage] = useState('Click to Start Calibration');
  const [reactionTime, setReactionTime] = useState(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);

  const handleClick = () => {
    if (state === 'idle' || state === 'done') {
      setState('waiting');
      setMessage('Wait for green...');
      setReactionTime(null);
      const randomDelay = Math.floor(Math.random() * 3000) + 1000; // 1s to 4s
      timeoutRef.current = setTimeout(() => {
        setState('ready');
        setMessage('TRIGGER INTERRUPT!');
        startTimeRef.current = performance.now();
      }, randomDelay);
    } else if (state === 'waiting') {
      clearTimeout(timeoutRef.current);
      setState('done');
      setMessage('False Trigger! Wait for green.');
    } else if (state === 'ready') {
      const rTime = Math.floor(performance.now() - startTimeRef.current);
      setReactionTime(rTime);
      setState('done');
      setMessage(`${rTime} ms`);
    }
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  let bgColor = 'var(--glass-bg)';
  let borderColor = 'var(--glass-border)';
  if (state === 'waiting') { bgColor = 'rgba(239, 68, 68, 0.2)'; borderColor = '#ef4444'; }
  if (state === 'ready') { bgColor = 'rgba(16, 185, 129, 0.4)'; borderColor = '#10b981'; }
  
  return (
    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        <Zap size={24} className="text-gradient" />
        <span style={{ fontWeight: 600 }}>Interrupt Calibration (Hardware ISR)</span>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Test your hardware's interrupt response time. When the status turns green, click as fast as possible.</p>
      
      <div 
        onClick={handleClick}
        style={{ 
          flex: 1, minHeight: '250px', background: bgColor, border: `3px solid ${borderColor}`,
          borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'background 0.1s ease', userSelect: 'none'
        }}
      >
        <span style={{ fontSize: state === 'done' && reactionTime ? '3rem' : '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: state === 'waiting' ? '#ef4444' : (state === 'ready' ? '#10b981' : 'var(--text-primary)') }}>
          {message}
        </span>
      </div>
      {state === 'done' && reactionTime !== null && (
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Click the panel to recalibrate.</p>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'left', width: '100%' }}>
        <Leaderboard gameId="reaction" currentScore={(state === 'done' && reactionTime !== null) ? reactionTime : 0} sortOrder="asc" scoreLabel="Time" scoreUnit="ms" onRestart={null} />
      </div>
    </div>
  );
}

// --- GAME 3: Binary Decoder (Math Game) ---
function BinaryGame() {
  const [binaryStr, setBinaryStr] = useState('');
  const [targetDec, setTargetDec] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  const generateBinary = () => {
    // 4-bit for early score, 8-bit for later
    const maxVal = score < 5 ? 15 : (score < 10 ? 63 : 255); 
    const val = Math.floor(Math.random() * maxVal) + 1;
    setTargetDec(val);
    const bin = val.toString(2).padStart(score < 5 ? 4 : 8, '0');
    setBinaryStr(bin);
    setInputVal('');
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    generateBinary();
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, timeLeft]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(inputVal) === targetDec) {
      setScore(s => s + 1);
      generateBinary();
    } else {
      // Penalty or shake? Just clear input
      setInputVal('');
    }
  };

  return (
    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <TerminalSquare size={24} className="text-gradient" />
          <span style={{ fontWeight: 600 }}>Binary Decoder</span>
        </div>
        {isPlaying && <div style={{ color: timeLeft <= 5 ? '#ef4444' : 'var(--text-primary)', fontWeight: 'bold' }}>00:{timeLeft.toString().padStart(2, '0')}</div>}
      </div>

      {!isPlaying && timeLeft === 0 && score > 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Time's Up!</h3>
          <Leaderboard gameId="binary" currentScore={score} onRestart={startGame} />
        </div>
      ) : !isPlaying ? (
         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Decode the hardware binary signals into decimal format as fast as possible. You have 30 seconds.</p>
          <button onClick={startGame} className="btn btn-primary" style={{ width: '100%' }}><Play size={18}/> Start Decoding</button>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '3rem', letterSpacing: '4px', color: '#10b981', marginBottom: '2rem', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px' }}>
            {binaryStr}
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="number" autoFocus
              value={inputVal} onChange={e => setInputVal(e.target.value)}
              placeholder="Decimal value..."
              style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff', fontSize: '1.2rem', outline: 'none', textAlign: 'center' }} 
            />
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
          <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Score: {score}</p>
        </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <Leaderboard gameId="binary" currentScore={(!isPlaying && timeLeft === 0 && score > 0) ? score : 0} onRestart={null} />
      </div>
    </div>
  );
}

// --- MAIN PLAYGROUND COMPONENT ---
export default function Playground() {
  const [activeGame, setActiveGame] = useState('memory');
  const [nickname, setNickname] = useState(localStorage.getItem('playground_nickname') || '');
  const [tempName, setTempName] = useState('');

  const handleSaveNickname = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      localStorage.setItem('playground_nickname', tempName.trim());
      setNickname(tempName.trim());
    }
  };

  const games = {
    'memory': { name: 'Circuit Memory', icon: <Cpu size={18}/>, comp: <MemoryGame /> },
    'reaction': { name: 'ISR Calibration', icon: <Zap size={18}/>, comp: <ReactionGame /> },
    'binary': { name: 'Binary Decoder', icon: <TerminalSquare size={18}/>, comp: <BinaryGame /> },
    'snake': { name: 'Classic Snake', icon: <Gamepad2 size={18}/>, comp: <SnakeGame /> },
    'pong': { name: 'Wall Pong', icon: <Activity size={18}/>, comp: <PongGame /> },
    'dino': { name: 'Offline Dino', icon: <Wind size={18}/>, comp: <DinoGame /> },
    'pacman': { name: 'Packet Sniffer', icon: <Ghost size={18}/>, comp: <PacmanGame /> },
    'car': { name: 'Retro Racer', icon: <CarIcon size={18}/>, comp: <CarGame /> },
    'bounce': { name: 'Nokia Bounce', icon: <Circle size={18}/>, comp: <BounceGame /> }
  };

  if (!nickname) {
    return (
      <div className="animate-fade-in-up section container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', maxWidth: '400px', width: '100%', border: '2px solid var(--accent-primary)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Welcome to the Hub</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Enter a nickname to track your high scores on the global leaderboards!</p>
          <form onSubmit={handleSaveNickname} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input autoFocus required maxLength={15} placeholder="Player One" value={tempName} onChange={e => setTempName(e.target.value)} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff', fontSize: '1.2rem', textAlign: 'center', outline: 'none' }} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Enter Playground</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <section className="page-header" style={{ textAlign: 'center', padding: '6rem 0 3rem' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Developer Playground</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Need a break? Explore these embedded-systems themed mini-games.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '1rem', paddingBottom: '6rem' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          
          {/* Game Selector Navbar */}
          <div className="glass" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem', borderRadius: '9999px', marginBottom: '3rem', justifyContent: 'center' }}>
            {Object.entries(games).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setActiveGame(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.75rem 1.5rem', borderRadius: '9999px',
                  background: activeGame === key ? 'var(--accent-primary)' : 'transparent',
                  color: activeGame === key ? '#fff' : 'var(--text-primary)',
                  fontWeight: activeGame === key ? 600 : 500,
                  border: 'none', cursor: 'pointer', transition: 'var(--transition-smooth)'
                }}
              >
                {info.icon} {info.name}
              </button>
            ))}
          </div>

          {/* ACTIVE GAME RENDERER */}
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {games[activeGame].comp}
          </div>

        </div>
      </section>

      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
