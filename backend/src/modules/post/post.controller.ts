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

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
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
  getSignalFeed(
    // We use ParseFloatPipe to convert the string query to a number
    @Query('lat', new ParseFloatPipe({ optional: true })) lat?: number,
    @Query('lng', new ParseFloatPipe({ optional: true })) lng?: number,
  ) {
    // If no coordinates are provided (user denied GPS),
    // we can use a default (like Dhaka center) or skip distance sorting
    const defaultLat = lat ?? 23.8103;
    const defaultLng = lng ?? 90.4125;

    return this.postService.getRankedSignalFeed(defaultLat, defaultLng);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.postService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
