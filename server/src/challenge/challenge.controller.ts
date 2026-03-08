import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto, SubmitAnswerDto } from './dto';

@Controller('challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Post()
  create(@Body() dto: CreateChallengeDto) {
    return this.challengeService.create(dto);
  }

  @Get('player/:playerId')
  findForPlayer(@Param('playerId') playerId: string) {
    return this.challengeService.findForPlayer(playerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengeService.findById(id);
  }

  @Post('submit')
  submit(@Body() dto: SubmitAnswerDto) {
    return this.challengeService.submitAnswer(dto);
  }
}
