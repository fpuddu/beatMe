import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const Home: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    try {
      const player = await api.createPlayer(username.trim());
      localStorage.setItem('player', JSON.stringify(player));
      navigate('/dashboard');
    } catch {
      setError('Failed to join. Try again.');
    }
  };

  return (
    <div className="page home-page">
      <div className="hero">
        <h1>beatMe</h1>
        <p className="tagline">
          Challenge your friends with musical beats, riffs, and solos.
          Can they guess the song? Can they finish the riff?
        </p>
      </div>

      <form className="join-form" onSubmit={handleJoin}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
        />
        <button type="submit">Play</button>
        {error && <p className="error">{error}</p>}
      </form>

      <div className="game-modes">
        <div className="mode-card">
          <h3>Guess the Song</h3>
          <p>Record a few notes from a song. Your friend has to guess what it is!</p>
        </div>
        <div className="mode-card">
          <h3>Complete the Riff</h3>
          <p>Send a guitar riff with missing notes. Can your friend fill in the gaps?</p>
        </div>
        <div className="mode-card">
          <h3>Continue the Beat</h3>
          <p>Start a drum pattern. Your friend needs to continue where you left off!</p>
        </div>
      </div>
    </div>
  );
};
