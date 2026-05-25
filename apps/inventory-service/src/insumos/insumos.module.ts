import { Module } from '@nestjs/common';
import { InsumosController } from './insumos.controller';
import { InsumosService } from './insumos.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [InsumosController],
  providers: [InsumosService, PrismaService],
})
export class InsumosModule {}
