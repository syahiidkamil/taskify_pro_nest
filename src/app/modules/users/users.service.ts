import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/providers/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(email: string, password: string, name?: string) {
    return this.prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  }
}
