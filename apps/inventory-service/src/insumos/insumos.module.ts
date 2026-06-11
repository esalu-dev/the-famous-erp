import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InsumosController } from './insumos.controller';
import { InsumosService } from './insumos.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANALYTICS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ANALYTICS_SERVICE_HOST || 'localhost',
          port: Number(process.env.ANALYTICS_SERVICE_TCP_PORT) || 3006,
        },
      },
    ]),
  ],
  controllers: [InsumosController],
  providers: [InsumosService, PrismaService],
})
export class InsumosModule {}
