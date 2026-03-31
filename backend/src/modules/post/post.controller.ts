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
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Query,
  ParseFloatPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const userId = req.user.sub || req.user.userId;
    return this.postService.create(createPostDto, userId, image);
  }

  @Get('feed')
  @UseGuards(JwtAuthGuard)
  getSignalFeed(
    @Req() req: any,
    @Query('lat', new ParseFloatPipe({ optional: true })) lat?: number,
    @Query('lng', new ParseFloatPipe({ optional: true })) lng?: number,
  ) {
    const defaultLat = lat ?? 23.8103;
    const defaultLng = lng ?? 90.4125;
    const userId = req.user.sub || req.user.userId || req.user.id; // same fallback chain as create
    return this.postService.getRankedSignalFeed(userId, defaultLat, defaultLng);
  }
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.postService.findAll(paginationDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyPosts(@Req() req: any) {
    // Extract user ID from the JWT payload attached by the Guard
    const userId = req.user.userId;
    return this.postService.findAllByUser(userId);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.postService.update(id, userId, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.postService.remove(id, userId);
  }
}
