import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('analytics/precio-historial')
  async getPrecioHistorial() {
    return this.prisma.precioHistorial.findMany({
      include: {
        insumo: {
          select: {
            nombre: true,
            tipo: true,
            unidadMedida: true,
            precioActual: true,
          },
        },
        usuario: {
          select: {
            nombre: true,
            correo: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  @EventPattern('insumo.precio_cambiado')
  async handleInsumoPrecioCambiado(
    @Payload()
    data: {
      insumoId: string;
      precioAnterior: number;
      precioNuevo: number;
      usuarioId: string;
    },
  ) {
    console.log(`[Analytics] Recibido evento insumo.precio_cambiado para insumo: ${data.insumoId}`);
    try {
      await this.prisma.precioHistorial.create({
        data: {
          insumoId: data.insumoId,
          precioAnterior: data.precioAnterior,
          precioNuevo: data.precioNuevo,
          usuarioId: data.usuarioId,
        },
      });
      console.log(
        `[Analytics] Registrado historial de precio para insumo ${data.insumoId} (anterior: ${data.precioAnterior}, nuevo: ${data.precioNuevo})`,
      );
    } catch (error) {
      console.error('[Analytics] Error al guardar el historial de precios:', error);
    }
  }
}
