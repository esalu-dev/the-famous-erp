import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { InsumosModule } from './insumos/insumos.module';
import { ServiciosModule } from './servicios/servicios.module';

@Module({
  imports: [InsumosModule, ProveedoresModule, ScheduleModule.forRoot(), ServiciosModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
