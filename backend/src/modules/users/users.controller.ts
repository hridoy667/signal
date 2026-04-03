import { Controller, Get, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  @ApiOperation({ summary: 'Get all users with cursor pagination' })
  findAll(@Query() query: PaginationDto) {
    return this.usersService.findAll(query);
  }

  /** Must be registered before @Get(':id') or "user-profile" is captured as an id. */
  @Get('user-profile')
  @UseGuards(JwtAuthGuard)
  getUserProfile(@Req() req: any) {
    return this.usersService.getUserProfile(req.user.userId);
  }

  @Get('profile/:userId')
  @UseGuards(JwtAuthGuard)
  getUserProfileById(@Req() req: any, @Param('userId') userId: string) {
    return this.usersService.getUserProfileForViewer(req.user.userId, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
