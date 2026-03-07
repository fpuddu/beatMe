import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player) private readonly repo: Repository<Player>,
  ) {}

  async findOrCreate(username: string): Promise<Player> {
    let player = await this.repo.findOne({ where: { username } });
    if (!player) {
      player = this.repo.create({ username });
      player = await this.repo.save(player);
    }
    return player;
  }

  findById(id: string): Promise<Player | null> {
    return this.repo.findOne({ where: { id } });
  }

  findAll(): Promise<Player[]> {
    return this.repo.find();
  }
}
