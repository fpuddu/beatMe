import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './challenge.entity';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge]), PlayerModule],
  providers: [ChallengeService],
  controllers: [ChallengeController],
  exports: [ChallengeService],
})
export class ChallengeModule {}
