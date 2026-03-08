import { ChallengeType, NoteEvent } from './challenge.entity';

export class CreateChallengeDto {
  senderUsername: string;
  receiverUsername: string;
  type: ChallengeType;
  fullSequence: NoteEvent[];
  hint?: string;
}

export class SubmitAnswerDto {
  challengeId: string;
  answer: NoteEvent[];
}
