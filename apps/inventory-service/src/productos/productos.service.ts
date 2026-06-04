import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Producto, Prisma } from '@the-famous-erp/database-client';

@Injectable()
export class ProductosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: Prisma.ProductoCreateInput & { receta?: { insumoId: string; cantidad: number }[] },
  ): Promise<Producto> {
    if (!data.nombre || data.nombre.trim() === '')
      throw new BadRequestException('El nombre del producto es obligatorio');
    if (!data.categoria || data.categoria.trim() === '')
      throw new BadRequestException('Debes seleccionar una categoría para el producto');
    if (data.precioVenta === undefined || data.precioVenta === null || data.precioVenta === '')
      throw new BadRequestException('Debes ingresar un precio de venta para este producto');

    try {
      const { receta, ...datosProducto } = data;

      let recetaFinal: { insumoId: string; cantidad: number }[] = [];

      if (datosProducto.categoria.trim() == 'Bebida') {
        if (!receta || receta.length === 0)
          throw new BadRequestException('Para las Bebidas es obligatorio enviar el ID del insumo');

        recetaFinal = receta.map((item: { insumoId: string; cantidad: number }) => ({
          insumoId: item.insumoId,
          cantidad: 1.0,
        }));
      } else {
        recetaFinal =
          receta && Array.isArray(receta)
            ? receta.map((item: { insumoId: string; cantidad: number }) => ({
                insumoId: item.insumoId,
                cantidad: item.cantidad,
              }))
            : [];
      }

      return await this.prismaService.producto.create({
        data: {
          nombre: datosProducto.nombre,
          categoria: datosProducto.categoria,
          precioVenta: datosProducto.precioVenta,
          imagenUrl: datosProducto.imagenUrl || null,
          activo: datosProducto.activo !== undefined ? datosProducto.activo : true,

          receta: {
            createMany: {
              data: recetaFinal,
            },
          },
        },
        include: {
          receta: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Error al crear el producto: ' + error);
    }
  }
}
