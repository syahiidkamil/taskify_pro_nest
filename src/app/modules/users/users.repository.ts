import { User } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/core/providers/prisma/prisma.service';
import { UserI } from './user.interface';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: UserI): Promise<User> {
    const { email, password, name } = user;

    return this.prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async updateUserById(userId: string, payload: any): Promise<boolean> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: payload,
    });
    return true;
  }

  async updateUserWithHashById(userId: string, payload: any): Promise<boolean> {
    await this.prisma.user.update({
      where: {
        id: userId,
        hashedRT: {
          not: null,
        },
      },
      data: payload,
    });
    return true;
  }
}
