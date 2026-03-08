import * as Tone from 'tone';
import { NoteEvent } from '../types';

const synths: Record<string, Tone.Synth | Tone.MembraneSynth | Tone.MetalSynth> = {};

function getSynth(instrument: string) {
  if (!synths[instrument]) {
    switch (instrument) {
      case 'drums':
        synths[instrument] = new Tone.MembraneSynth().toDestination();
        break;
      case 'hihat':
        synths[instrument] = new Tone.MetalSynth({
          volume: -10,
          envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
        }).toDestination();
        break;
      default:
        synths[instrument] = new Tone.Synth().toDestination();
    }
  }
  return synths[instrument];
}

export async function ensureAudioStarted(): Promise<void> {
  if (Tone.getContext().state !== 'running') {
    await Tone.start();
  }
}

export function playNote(event: NoteEvent): void {
  const synth = getSynth(event.instrument);
  if (synth instanceof Tone.MetalSynth) {
    synth.triggerAttackRelease('16n', Tone.now());
  } else {
    synth.triggerAttackRelease(event.note, event.duration, Tone.now());
  }
}

export function playSequence(
  events: NoteEvent[],
  onNote?: (event: NoteEvent) => void,
): void {
  const now = Tone.now();
  events.forEach((event) => {
    const synth = getSynth(event.instrument);
    const time = now + event.time;

    if (synth instanceof Tone.MetalSynth) {
      synth.triggerAttackRelease('16n', time);
    } else {
      synth.triggerAttackRelease(event.note, event.duration, time);
    }

    if (onNote) {
      Tone.getTransport().schedule(() => onNote(event), time);
    }
  });
}

export function stopAll(): void {
  Object.values(synths).forEach((s) => {
    if ('releaseAll' in s) {
      (s as any).releaseAll();
    }
  });
}

/** Available notes for the pad grid */
export const PAD_NOTES = [
  'C4', 'D4', 'E4', 'F4',
  'G4', 'A4', 'B4', 'C5',
];

export const INSTRUMENTS = ['synth', 'drums', 'hihat'] as const;
