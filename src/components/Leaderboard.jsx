import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, addDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Trophy, Medal, Crown } from 'lucide-react';

export default function Leaderboard({ gameId, currentScore, onRestart, sortOrder = 'desc', scoreLabel = 'Score', scoreUnit = '' }) {
  const [leaders, setLeaders] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Grab nickname from local storage that was set in Playground Hub
  const playerName = localStorage.getItem('playground_nickname') || 'Anonymous';

  useEffect(() => {
    // Listen to Firebase game_scores collection
    const q = query(
      collection(db, 'game_scores'), 
      where('gameId', '==', gameId), 
      orderBy('score', sortOrder), 
      limit(5)
    );
    
    const unsub = onSnapshot(q, (snapshot) => {
      setLeaders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      console.error("Firebase Read Error: Make sure your Firestore rules allow public reads on game_scores", err);
      setLoading(false);
    });
    
    return () => unsub();
  }, [gameId, sortOrder]);

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    if (currentScore <= 0) return;
    
    try {
      await addDoc(collection(db, 'game_scores'), {
        gameId,
        playerName: playerName.trim(),
        score: currentScore,
        date: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Firebase Write Error: Make sure your Firestore rules allow public writes on game_scores", err);
      alert("Error submitting score. Please check Firebase permissions.");
    }
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Crown size={16} color="#fbbf24" />;
    if (index === 1) return <Medal size={16} color="#94a3b8" />;
    if (index === 2) return <Medal size={16} color="#b45309" />;
    return <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0 4px' }}>{index + 1}</span>;
  };

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
        <Trophy size={20} /> Global High Scores
      </h4>
      
      {currentScore > 0 && !submitted ? (
        <form onSubmit={handleSubmitScore} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Playing as <strong style={{color: 'var(--text-primary)'}}>{playerName}</strong>
          </span>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', marginLeft: 'auto' }}>
            Submit: {currentScore}{scoreUnit}
          </button>
        </form>
      ) : submitted && (
        <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '4px', textAlign: 'center', marginBottom: '1.5rem' }}>
          Score Submitted Globally!
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading global scores...</div>
      ) : leaders.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No scores yet. Be the first!</div>
      ) : (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0, padding: 0, listStyle: 'none' }}>
          {leaders.map((leader, i) => (
            <li key={leader.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {getRankIcon(i)}
                <span style={{ fontWeight: i === 0 ? 'bold' : 'normal', color: i === 0 ? '#fbbf24' : 'var(--text-primary)' }}>{leader.playerName}</span>
              </div>
              <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{leader.score}{scoreUnit}</span>
            </li>
          ))}
        </ul>
      )}

      {onRestart && (
        <button onClick={onRestart} className="btn btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }}>Play Again</button>
      )}
    </div>
  );
}
