import React from 'react';
import { NoteEvent } from '../types';
import { PAD_NOTES, INSTRUMENTS, playNote, ensureAudioStarted } from '../services/audio';

interface BeatPadProps {
  instrument: string;
  onNoteRecorded: (event: NoteEvent) => void;
  disabled?: boolean;
}

export const BeatPad: React.FC<BeatPadProps> = ({
  instrument,
  onNoteRecorded,
  disabled = false,
}) => {
  const startTime = React.useRef(Date.now());

  React.useEffect(() => {
    startTime.current = Date.now();
  }, []);

  const handlePadClick = async (note: string) => {
    if (disabled) return;
    await ensureAudioStarted();

    const event: NoteEvent = {
      note,
      time: (Date.now() - startTime.current) / 1000,
      duration: 0.25,
      instrument,
    };

    playNote(event);
    onNoteRecorded(event);
  };

  const notes = instrument === 'hihat' ? ['C4'] : PAD_NOTES;

  return (
    <div className="beat-pad">
      <h3>{instrument.toUpperCase()}</h3>
      <div className="pad-grid">
        {notes.map((note) => (
          <button
            key={note}
            className={`pad-button pad-${instrument}`}
            onClick={() => handlePadClick(note)}
            disabled={disabled}
          >
            {note}
          </button>
        ))}
      </div>
    </div>
  );
};
