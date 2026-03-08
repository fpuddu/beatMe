import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name) private readonly model: Model<PlayerDocument>,
  ) {}

  async findOrCreate(username: string): Promise<PlayerDocument> {
    let player = await this.model.findOne({ username });
    if (!player) {
      player = await this.model.create({ username });
    }
    return player;
  }

  findById(id: string): Promise<PlayerDocument | null> {
    return this.model.findById(id).exec();
  }

  findAll(): Promise<PlayerDocument[]> {
    return this.model.find().exec();
  }
}
