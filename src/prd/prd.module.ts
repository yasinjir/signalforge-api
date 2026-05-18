import { Module } from '@nestjs/common';
import { PrdController } from './prd.controller';
import { PrdService } from './prd.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PrdController],
  providers: [PrdService],
})
export class PrdModule {}