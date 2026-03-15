/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto} from './dto/register.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { LoginDto } from './dto/login.dto';
// import { memoryStorage } from 'multer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: 8 * 1024 * 1024,
      },
    }),
  )
  create(
    @Body() registerDto: RegisterDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.authService.create(registerDto, image);
  }


  @Post('login')
  login(@Body() loginDto:LoginDto){
    return this.authService.login(loginDto)
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}


