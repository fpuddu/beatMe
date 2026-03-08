import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BeatPad } from '../components/BeatPad';
import { SequenceVisualizer } from '../components/SequenceVisualizer';
import { api } from '../services/api';
import { playSequence, ensureAudioStarted } from '../services/audio';
import { Challenge, NoteEvent } from '../types';

export const PlayChallenge: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [myNotes, setMyNotes] = useState<NoteEvent[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getChallenge(id).then(setChallenge).catch(() => navigate('/dashboard'));
  }, [id, navigate]);

  const handleListen = async () => {
    if (!challenge?.partialSequence) return;
    await ensureAudioStarted();
    playSequence(challenge.partialSequence);
  };

  const handleNoteRecorded = useCallback((event: NoteEvent) => {
    setMyNotes((prev) => [...prev, event]);
  }, []);

  const handleSubmit = async () => {
    if (!challenge) return;
    setSubmitted(true);
    try {
      const result = await api.submitAnswer(challenge.id, myNotes);
      setScore(result.score);
    } catch {
      alert('Failed to submit answer');
      setSubmitted(false);
    }
  };

  if (!challenge) {
    return <div className="page">Loading challenge...</div>;
  }

  return (
    <div className="page play-page">
      <h1>Challenge from {challenge.sender.username}</h1>
      <p className="challenge-type">{challenge.type.replace(/_/g, ' ')}</p>
      {challenge.hint && <p className="challenge-hint">Hint: {challenge.hint}</p>}

      <section className="listen-section">
        <h2>Listen to the beat</h2>
        <button className="btn btn-primary" onClick={handleListen}>
          Play the Beat
        </button>
        {challenge.partialSequence && (
          <SequenceVisualizer
            sequence={challenge.partialSequence}
            label="What you hear"
          />
        )}
      </section>

      {score === null ? (
        <section className="answer-section">
          <h2>
            {challenge.type === 'guess_song'
              ? 'Recreate the full song!'
              : challenge.type === 'continue_beat'
                ? 'Continue the beat!'
                : 'Fill in the missing notes!'}
          </h2>
          <BeatPad
            instrument={
              challenge.partialSequence?.[0]?.instrument || 'synth'
            }
            onNoteRecorded={handleNoteRecorded}
            disabled={submitted}
          />
          <SequenceVisualizer sequence={myNotes} label="Your Answer" />
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitted || myNotes.length === 0}
          >
            {submitted ? 'Submitting...' : 'Submit Answer'}
          </button>
        </section>
      ) : (
        <section className="result-section">
          <h2>Results</h2>
          <div className={`score-display ${score >= 70 ? 'great' : score >= 40 ? 'ok' : 'low'}`}>
            <span className="score-number">{score}</span>
            <span className="score-label">/100</span>
          </div>
          <p className="score-message">
            {score >= 90
              ? 'Perfect! You nailed it!'
              : score >= 70
                ? 'Great job! Almost perfect!'
                : score >= 40
                  ? 'Not bad! Keep practicing!'
                  : 'Better luck next time!'}
          </p>
          <button className="btn" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </section>
      )}
    </div>
  );
};
