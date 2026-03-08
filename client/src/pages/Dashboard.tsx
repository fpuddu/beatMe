import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Challenge, Player } from '../types';

export const Dashboard: React.FC = () => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('player');
    if (!stored) {
      navigate('/');
      return;
    }
    const p: Player = JSON.parse(stored);
    setPlayer(p);
    api.getChallengesForPlayer(p.id).then(setChallenges).catch(() => {});
  }, [navigate]);

  if (!player) return null;

  const received = challenges.filter((c) => c.receiver.id === player.id);
  const sent = challenges.filter((c) => c.sender.id === player.id);

  return (
    <div className="page dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome, {player.username}!</h1>
        <Link to="/create" className="btn btn-primary">
          New Challenge
        </Link>
      </header>

      <section>
        <h2>Challenges Received</h2>
        {received.length === 0 ? (
          <p className="empty-state">No challenges yet. Ask a friend to send you one!</p>
        ) : (
          <div className="challenge-list">
            {received.map((c) => (
              <div key={c.id} className={`challenge-card status-${c.status}`}>
                <div className="challenge-info">
                  <span className="from">From: {c.sender.username}</span>
                  <span className="type">{c.type.replace('_', ' ')}</span>
                  {c.hint && <span className="hint">Hint: {c.hint}</span>}
                </div>
                <div className="challenge-actions">
                  {c.status === 'pending' ? (
                    <Link to={`/play/${c.id}`} className="btn btn-play">
                      Play
                    </Link>
                  ) : (
                    <span className="score">Score: {c.score ?? '—'}/100</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Challenges Sent</h2>
        {sent.length === 0 ? (
          <p className="empty-state">You haven't sent any challenges yet.</p>
        ) : (
          <div className="challenge-list">
            {sent.map((c) => (
              <div key={c.id} className={`challenge-card status-${c.status}`}>
                <div className="challenge-info">
                  <span className="to">To: {c.receiver.username}</span>
                  <span className="type">{c.type.replace('_', ' ')}</span>
                  <span className="status">{c.status}</span>
                </div>
                {c.score !== null && (
                  <span className="score">Score: {c.score}/100</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
