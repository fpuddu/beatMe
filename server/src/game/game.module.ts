import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { ChallengeModule } from '../challenge/challenge.module';

@Module({
  imports: [ChallengeModule],
  providers: [GameGateway],
})
export class GameModule {}
