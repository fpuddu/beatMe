import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Challenge, ChallengeSchema } from './challenge.entity';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
    PlayerModule,
  ],
  providers: [ChallengeService],
  controllers: [ChallengeController],
  exports: [ChallengeService],
})
export class ChallengeModule {}
