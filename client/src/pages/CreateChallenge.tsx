import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BeatPad } from '../components/BeatPad';
import { SequenceVisualizer } from '../components/SequenceVisualizer';
import { api } from '../services/api';
import { NoteEvent, ChallengeType, Player } from '../types';
import { INSTRUMENTS } from '../services/audio';

export const CreateChallenge: React.FC = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<ChallengeType>(ChallengeType.GUESS_SONG);
  const [instrument, setInstrument] = useState<string>('synth');
  const [receiver, setReceiver] = useState('');
  const [hint, setHint] = useState('');
  const [sequence, setSequence] = useState<NoteEvent[]>([]);
  const [sending, setSending] = useState(false);

  const stored = localStorage.getItem('player');
  const player: Player | null = stored ? JSON.parse(stored) : null;

  const handleNoteRecorded = useCallback((event: NoteEvent) => {
    setSequence((prev) => [...prev, event]);
  }, []);

  const handleSend = async () => {
    if (!player || !receiver.trim() || sequence.length === 0) return;
    setSending(true);
    try {
      await api.createChallenge({
        senderUsername: player.username,
        receiverUsername: receiver.trim(),
        type,
        fullSequence: sequence,
        hint: hint || undefined,
      });
      navigate('/dashboard');
    } catch {
      alert('Failed to send challenge');
      setSending(false);
    }
  };

  const handleClear = () => setSequence([]);

  if (!player) {
    navigate('/');
    return null;
  }

  return (
    <div className="page create-page">
      <h1>Create a Challenge</h1>

      <div className="create-form">
        <div className="form-row">
          <label>Challenge Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ChallengeType)}
          >
            <option value={ChallengeType.GUESS_SONG}>Guess the Song</option>
            <option value={ChallengeType.COMPLETE_RIFF}>Complete the Riff</option>
            <option value={ChallengeType.CONTINUE_BEAT}>Continue the Beat</option>
          </select>
        </div>

        <div className="form-row">
          <label>Instrument</label>
          <div className="instrument-selector">
            {INSTRUMENTS.map((inst) => (
              <button
                key={inst}
                className={`btn ${instrument === inst ? 'btn-active' : ''}`}
                onClick={() => setInstrument(inst)}
              >
                {inst}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label>Send to</label>
          <input
            type="text"
            placeholder="Friend's username"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>Hint (optional)</label>
          <input
            type="text"
            placeholder="e.g. song title, genre..."
            value={hint}
            onChange={(e) => setHint(e.target.value)}
          />
        </div>
      </div>

      <div className="recording-area">
        <h2>Record your beat</h2>
        <p>Tap the pads to record notes. They'll be sent as a challenge!</p>
        <BeatPad
          instrument={instrument}
          onNoteRecorded={handleNoteRecorded}
        />
        <SequenceVisualizer sequence={sequence} label="Your Recording" />
        <div className="recording-actions">
          <button className="btn" onClick={handleClear} disabled={sequence.length === 0}>
            Clear
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={sending || sequence.length === 0 || !receiver.trim()}
          >
            {sending ? 'Sending...' : 'Send Challenge'}
          </button>
        </div>
      </div>
    </div>
  );
};
