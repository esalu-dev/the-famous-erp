import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 2 * * *', {
    timeZone: 'America/Mexico_City',
  })
  async calcularClasificacionABC() {
    const configRecord = await this.prisma.configuracion.findFirst();
    const umbralA = configRecord ? Number(configRecord.umbralAbcA) : 80;
    const umbralB = configRecord ? Number(configRecord.umbralAbcB) : 95;

    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const insumos = await this.prisma.insumo.findMany({
      include: {
        recetas: {
          include: {
            producto: {
              include: {
                ventas: {
                  where: {
                    fecha: {
                      gte: hace30Dias,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const listaConsumo = insumos.map((insumo) => {
      let consumoTotal = 0;

      insumo.recetas.forEach((receta) => {
        const totalVendido = receta.producto.ventas.reduce((acc, v) => acc + v.cantidad, 0);
        consumoTotal += totalVendido * Number(receta.cantidad);
      });

      return {
        id: insumo.id,
        nombre: insumo.nombre,
        valorInversion: consumoTotal * Number(insumo.precioActual),
      };
    });

    listaConsumo.sort((a, b) => b.valorInversion - a.valorInversion);
    const inversionTotal = listaConsumo.reduce((acc, item) => acc + item.valorInversion, 0);

    let acumulado = 0;
    const resultados: any[] = [];

    for (const item of listaConsumo) {
      const porcentaje = inversionTotal > 0 ? (item.valorInversion / inversionTotal) * 100 : 0;
      acumulado += porcentaje;

      let nuevaCategoria: 'A' | 'B' | 'C' = 'C';
      if (inversionTotal > 0) {
        if (acumulado <= umbralA) nuevaCategoria = 'A';
        else if (acumulado <= umbralB) nuevaCategoria = 'B';
      }

      await this.prisma.insumo.update({
        where: { id: item.id },
        data: { categoria: nuevaCategoria },
      });

      resultados.push({ ...item, categoria: nuevaCategoria });
    }

    this.logger.log('Clasificación ABC completada');
    return {
      mensaje: 'Clasificación ABC completada con éxito',
      totalInsumos: resultados.length,
      detalle: resultados,
    };
  }
}
