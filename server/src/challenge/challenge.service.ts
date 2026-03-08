import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Challenge,
  ChallengeDocument,
  ChallengeStatus,
  ChallengeType,
  NoteEvent,
} from './challenge.entity';
import { PlayerService } from '../player/player.service';
import { CreateChallengeDto, SubmitAnswerDto } from './dto';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly model: Model<ChallengeDocument>,
    private readonly playerService: PlayerService,
  ) {}

  async create(dto: CreateChallengeDto): Promise<ChallengeDocument> {
    const sender = await this.playerService.findOrCreate(dto.senderUsername);
    const receiver = await this.playerService.findOrCreate(
      dto.receiverUsername,
    );

    const partial = this.generatePartialSequence(dto.fullSequence, dto.type);

    const challenge = await this.model.create({
      type: dto.type,
      status: ChallengeStatus.PENDING,
      fullSequence: dto.fullSequence,
      partialSequence: partial,
      hint: dto.hint,
      sender: sender._id as any,
      receiver: receiver._id as any,
    } as any);

    return challenge.populate(['sender', 'receiver']);
  }

  async findForPlayer(playerId: string): Promise<ChallengeDocument[]> {
    return this.model
      .find({
        $or: [{ sender: playerId }, { receiver: playerId }],
      } as any)
      .populate(['sender', 'receiver'])
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<ChallengeDocument> {
    const challenge = await this.model
      .findById(id)
      .populate(['sender', 'receiver'])
      .exec();
    if (!challenge) throw new NotFoundException('Challenge not found');
    return challenge;
  }

  async submitAnswer(dto: SubmitAnswerDto): Promise<ChallengeDocument> {
    const challenge = await this.findById(dto.challengeId);
    const score = this.scoreAnswer(challenge.fullSequence, dto.answer);
    challenge.score = score;
    challenge.status = ChallengeStatus.COMPLETED;
    await challenge.save();
    return challenge;
  }

  private generatePartialSequence(
    full: NoteEvent[],
    type: ChallengeType,
  ): NoteEvent[] {
    if (type === ChallengeType.GUESS_SONG) {
      return full.filter((_, i) => i % 3 === 0);
    }
    if (type === ChallengeType.CONTINUE_BEAT) {
      return full.slice(0, Math.ceil(full.length / 2));
    }
    return full.filter(() => Math.random() > 0.5);
  }

  private scoreAnswer(full: NoteEvent[], answer: NoteEvent[]): number {
    if (full.length === 0) return 100;

    const timeTolerance = 0.15;
    let matched = 0;

    for (const expected of full) {
      const hit = answer.find(
        (a) =>
          a.note === expected.note &&
          a.instrument === expected.instrument &&
          Math.abs(a.time - expected.time) < timeTolerance,
      );
      if (hit) matched++;
    }

    return Math.round((matched / full.length) * 100);
  }
}
