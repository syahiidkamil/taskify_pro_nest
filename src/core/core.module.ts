import { Module, Global } from '@nestjs/common';

import { PrismaService } from './providers/prisma/prisma.service';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [AuthModule],
})
export class CoreModule {}
