import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PlayerModule } from './player/player.module';
import { ChallengeModule } from './challenge/challenge.module';
import { GameModule } from './game/game.module';
import { Player } from './player/player.entity';
import { Challenge } from './challenge/challenge.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'beatme.db',
      entities: [Player, Challenge],
      synchronize: true, // dev only — use migrations in production
    }),
    PlayerModule,
    ChallengeModule,
    GameModule,
  ],
})
export class AppModule {}
