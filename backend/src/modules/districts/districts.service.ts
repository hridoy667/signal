import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DistrictsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.districts.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
  }
}
