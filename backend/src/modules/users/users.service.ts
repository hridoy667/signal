import { Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async findAll(pagination: PaginationDto) {
    const { cursor, limit } = pagination;
    const take = Number(limit);

    const users = await this.prisma.user.findMany({
      take: take,
      ...(cursor && {
        skip: 1, // Skip the cursor itself
        cursor: { id: cursor },
      }),
      orderBy: {
        createdAt: 'asc', // Or 'desc' depending on your preference
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        avatarUrl: true,
      },
    });

    // Calculate the next cursor
    const nextCursor =
      users.length === take ? users[users.length - 1].id : null;

    return {
      data: users,
      meta: {
        nextCursor,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
