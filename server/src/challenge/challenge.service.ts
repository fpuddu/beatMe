import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Challenge,
  ChallengeStatus,
  ChallengeType,
  NoteEvent,
} from './challenge.entity';
import { PlayerService } from '../player/player.service';
import { CreateChallengeDto, SubmitAnswerDto } from './dto';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(Challenge) private readonly repo: Repository<Challenge>,
    private readonly playerService: PlayerService,
  ) {}

  async create(dto: CreateChallengeDto): Promise<Challenge> {
    const sender = await this.playerService.findOrCreate(dto.senderUsername);
    const receiver = await this.playerService.findOrCreate(
      dto.receiverUsername,
    );

    const partial = this.generatePartialSequence(dto.fullSequence, dto.type);

    const challenge = this.repo.create({
      type: dto.type,
      status: ChallengeStatus.PENDING,
      fullSequence: dto.fullSequence,
      partialSequence: partial,
      hint: dto.hint,
      sender,
      receiver,
    });

    return this.repo.save(challenge);
  }

  async findForPlayer(playerId: string): Promise<Challenge[]> {
    return this.repo.find({
      where: [
        { sender: { id: playerId } },
        { receiver: { id: playerId } },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Challenge> {
    const challenge = await this.repo.findOne({ where: { id } });
    if (!challenge) throw new NotFoundException('Challenge not found');
    return challenge;
  }

  async submitAnswer(dto: SubmitAnswerDto): Promise<Challenge> {
    const challenge = await this.findById(dto.challengeId);
    const score = this.scoreAnswer(challenge.fullSequence, dto.answer);
    challenge.score = score;
    challenge.status = ChallengeStatus.COMPLETED;
    return this.repo.save(challenge);
  }

  /**
   * Generate a partial sequence by removing some notes depending on challenge type.
   */
  private generatePartialSequence(
    full: NoteEvent[],
    type: ChallengeType,
  ): NoteEvent[] {
    if (type === ChallengeType.GUESS_SONG) {
      // Show ~40% of the notes as hints
      return full.filter((_, i) => i % 3 === 0);
    }
    if (type === ChallengeType.CONTINUE_BEAT) {
      // Show the first half
      return full.slice(0, Math.ceil(full.length / 2));
    }
    // COMPLETE_RIFF: remove random notes
    return full.filter(() => Math.random() > 0.5);
  }

  /**
   * Simple scoring: compare submitted notes to the full sequence.
   * Each matched note (within tolerance) gets points.
   */
  private scoreAnswer(full: NoteEvent[], answer: NoteEvent[]): number {
    if (full.length === 0) return 100;

    const timeTolerance = 0.15; // seconds
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
