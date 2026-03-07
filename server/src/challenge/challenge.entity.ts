import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Player } from '../player/player.entity';

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

/**
 * A beat/note sequence stored as JSON.
 * Each step has: { note: string, time: number, duration: number, instrument: string }
 */
export interface NoteEvent {
  note: string;
  time: number;
  duration: number;
  instrument: string;
}

@Entity()
export class Challenge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', default: ChallengeType.GUESS_SONG })
  type: ChallengeType;

  @Column({ type: 'varchar', default: ChallengeStatus.PENDING })
  status: ChallengeStatus;

  /** The full sequence the sender recorded */
  @Column({ type: 'simple-json' })
  fullSequence: NoteEvent[];

  /** The partial sequence shown to the receiver (with gaps) */
  @Column({ type: 'simple-json', nullable: true })
  partialSequence: NoteEvent[] | null;

  /** Optional hint, e.g. song title or genre */
  @Column({ nullable: true })
  hint: string;

  /** Score the receiver achieved (0-100) */
  @Column({ type: 'int', nullable: true })
  score: number | null;

  @ManyToOne(() => Player, (p) => p.sentChallenges, { eager: true })
  sender: Player;

  @ManyToOne(() => Player, (p) => p.receivedChallenges, { eager: true })
  receiver: Player;

  @CreateDateColumn()
  createdAt: Date;
}
