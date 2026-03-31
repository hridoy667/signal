/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VotingService } from './voting.service';
import { CreateVotingDto } from './dto/create-voting.dto';
import { UpdateVotingDto } from './dto/update-voting.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('voting')
export class VotingController {
  constructor(private readonly votingService: VotingService) {}

  @Post()
  vote(@Body() createVotingDto: CreateVotingDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.votingService.vote(userId, createVotingDto);
  }

  @Get()
  findAll() {
    return this.votingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.votingService.findOne(+id);
  }

  // @Get('top-votes')
  // findTopVotes() {
  //   return this.votingService.findTopVotes();
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVotingDto: UpdateVotingDto) {
    return this.votingService.update(+id, updateVotingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.votingService.remove(+id);
  }
}
