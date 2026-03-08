import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  create(@Body('username') username: string) {
    return this.playerService.findOrCreate(username);
  }

  @Get()
  findAll() {
    return this.playerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerService.findById(id);
  }
}
