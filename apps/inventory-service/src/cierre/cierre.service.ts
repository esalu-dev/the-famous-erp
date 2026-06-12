import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CierreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStatus(fechaStr: string) {
    const targetDate = new Date(fechaStr);
    const ventas = await this.prismaService.ventaDiaria.findMany({
      where: { fecha: targetDate },
    });

    if (ventas.length === 0) {
      return { status: 'NO_REGISTRADO', count: 0 };
    }

    const allProcesadas = ventas.every((v) => v.procesado);
    if (allProcesadas) {
      return { status: 'PROCESADO', count: ventas.length };
    }

    return { status: 'PENDIENTE', count: ventas.length };
  }

  async getVentas(fechaStr: string) {
    const targetDate = new Date(fechaStr);
    return this.prismaService.ventaDiaria.findMany({
      where: { fecha: targetDate },
      include: {
        producto: true,
      },
    });
  }

  async registrarVentas(
    fechaStr: string,
    registradoPor: string,
    ventasDto: { productoId: string; cantidad: number }[],
  ) {
    const status = await this.getStatus(fechaStr);
    if (status.status === 'PROCESADO') {
      throw new BadRequestException(
        'El cierre para esta fecha ya fue procesado y no se puede modificar.',
      );
    }

    const targetDate = new Date(fechaStr);

    // Delete existing pending sales for this date to clear prior state
    await this.prismaService.ventaDiaria.deleteMany({
      where: {
        fecha: targetDate,
        procesado: false,
      },
    });

    // Bulk create only positive sold products
    const records = ventasDto
      .filter((v) => v.cantidad > 0)
      .map((v) => ({
        fecha: targetDate,
        productoId: v.productoId,
        cantidad: v.cantidad,
        registradoPor,
        procesado: false,
      }));

    if (records.length > 0) {
      await this.prismaService.ventaDiaria.createMany({
        data: records,
      });
    }

    return { success: true, message: 'Ventas registradas correctamente' };
  }

  async procesarCierre(fechaStr: string) {
    const targetDate = new Date(fechaStr);
    const ventas = await this.prismaService.ventaDiaria.findMany({
      where: {
        fecha: targetDate,
        procesado: false,
      },
      include: {
        producto: {
          include: {
            receta: {
              include: {
                insumo: true,
              },
            },
          },
        },
      },
    });

    if (ventas.length === 0) {
      const yaProcesados = await this.prismaService.ventaDiaria.count({
        where: { fecha: targetDate, procesado: true },
      });
      if (yaProcesados > 0) {
        throw new BadRequestException('El cierre para esta fecha ya fue procesado.');
      }
      throw new BadRequestException('No hay ventas registradas para procesar en esta fecha.');
    }

    let ingresosTotales = 0;
    let costoInsumosTotales = 0;
    const insumoDeductions: Record<
      string,
      { cantidad: number; nombre: string; unidad: string; actual: number; minima: number }
    > = {};

    for (const venta of ventas) {
      const cantidadVendida = venta.cantidad;
      const precioVenta = Number(venta.producto.precioVenta);
      ingresosTotales += precioVenta * cantidadVendida;

      // Add each recipe item to required deductions
      for (const recetaItem of venta.producto.receta) {
        const insumoId = recetaItem.insumoId;
        const qtyRequired = Number(recetaItem.cantidad) * cantidadVendida;
        const precioInsumo = Number(recetaItem.insumo.precioActual);
        costoInsumosTotales += precioInsumo * qtyRequired;

        if (!insumoDeductions[insumoId]) {
          insumoDeductions[insumoId] = {
            cantidad: 0,
            nombre: recetaItem.insumo.nombre,
            unidad: recetaItem.insumo.unidadMedida,
            actual: Number(recetaItem.insumo.cantidadActual),
            minima: Number(recetaItem.insumo.cantidadMinima),
          };
        }
        insumoDeductions[insumoId].cantidad += qtyRequired;
      }
    }

    const warnings: string[] = [];

    // DB Transaction to guarantee atomic operations
    await this.prismaService.$transaction(async (tx) => {
      // Deduct inventory
      for (const insumoId of Object.keys(insumoDeductions)) {
        const ded = insumoDeductions[insumoId];
        const nuevoStock = ded.actual - ded.cantidad;

        await tx.insumo.update({
          where: { id: insumoId },
          data: {
            cantidadActual: nuevoStock,
          },
        });

        // Trigger warning if stock falls below minimum
        if (nuevoStock < ded.minima) {
          warnings.push(
            `El insumo "${ded.nombre}" está bajo el mínimo (Stock actual: ${nuevoStock.toFixed(2)} ${ded.unidad}, Mínimo: ${ded.minima} ${ded.unidad})`,
          );
        }
      }

      // Mark all sales for the date as processed
      await tx.ventaDiaria.updateMany({
        where: {
          fecha: targetDate,
          procesado: false,
        },
        data: {
          procesado: true,
        },
      });
    });

    const gananciaNeto = ingresosTotales - costoInsumosTotales;
    const margenNeto = ingresosTotales > 0 ? (gananciaNeto / ingresosTotales) * 100 : 0;

    return {
      success: true,
      fecha: fechaStr,
      resumen: {
        ingresosTotales,
        costoInsumosTotales,
        gananciaNeto,
        margenNeto,
      },
      warnings,
    };
  }

  async getHistoricoVentas() {
    return this.prismaService.ventaDiaria.findMany({
      include: {
        producto: {
          include: {
            receta: {
              include: {
                insumo: true,
              },
            },
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }
}
