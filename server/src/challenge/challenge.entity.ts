import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
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

export interface NoteEvent {
  note: string;
  time: number;
  duration: number;
  instrument: string;
}

export type ChallengeDocument = HydratedDocument<Challenge>;

@Schema({ timestamps: true })
export class Challenge {
  id: string;

  @Prop({ type: String, enum: ChallengeType, default: ChallengeType.GUESS_SONG })
  type: ChallengeType;

  @Prop({ type: String, enum: ChallengeStatus, default: ChallengeStatus.PENDING })
  status: ChallengeStatus;

  @Prop({ type: [Object], required: true })
  fullSequence: NoteEvent[];

  @Prop({ type: [Object], default: null })
  partialSequence: NoteEvent[] | null;

  @Prop()
  hint: string;

  @Prop({ type: Number, default: null })
  score: number | null;

  @Prop({ type: Types.ObjectId, ref: 'Player', required: true })
  sender: Player;

  @Prop({ type: Types.ObjectId, ref: 'Player', required: true })
  receiver: Player;

  createdAt: Date;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);

ChallengeSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
