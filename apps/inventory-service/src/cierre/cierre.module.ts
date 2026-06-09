import { Module } from '@nestjs/common';
import { CierreController } from './cierre.controller';
import { CierreService } from './cierre.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CierreController],
  providers: [CierreService],
  exports: [CierreService],
})
export class CierreModule {}
