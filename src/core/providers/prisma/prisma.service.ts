import { PrismaClient } from '@prisma/client';

import { Global, Injectable, OnModuleInit } from '@nestjs/common';

@Global()
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    console.info('MongoDB Connected');
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
