export interface NoteEvent {
  note: string;
  time: number;
  duration: number;
  instrument: string;
}

export enum ChallengeType {
  GUESS_SONG = 'guess_song',
  COMPLETE_RIFF = 'complete_riff',
  CONTINUE_BEAT = 'continue_beat',
}

export enum ChallengeStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

export interface Player {
  id: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  status: ChallengeStatus;
  fullSequence: NoteEvent[];
  partialSequence: NoteEvent[] | null;
  hint?: string;
  score: number | null;
  sender: Player;
  receiver: Player;
  createdAt: string;
}
