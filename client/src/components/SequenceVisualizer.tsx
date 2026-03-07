import React from 'react';
import { NoteEvent } from '../types';

interface SequenceVisualizerProps {
  sequence: NoteEvent[];
  highlightIndex?: number;
  label?: string;
}

export const SequenceVisualizer: React.FC<SequenceVisualizerProps> = ({
  sequence,
  highlightIndex,
  label = 'Sequence',
}) => {
  if (sequence.length === 0) {
    return <div className="sequence-viz empty">No notes recorded yet</div>;
  }

  const maxTime = Math.max(...sequence.map((e) => e.time)) + 1;

  return (
    <div className="sequence-viz">
      <h4>{label} ({sequence.length} notes)</h4>
      <div className="sequence-timeline">
        {sequence.map((event, i) => (
          <div
            key={i}
            className={`note-block ${event.instrument} ${i === highlightIndex ? 'highlight' : ''}`}
            style={{
              left: `${(event.time / maxTime) * 100}%`,
              width: `${Math.max((event.duration / maxTime) * 100, 2)}%`,
            }}
            title={`${event.note} (${event.instrument})`}
          >
            {event.note}
          </div>
        ))}
      </div>
    </div>
  );
};
