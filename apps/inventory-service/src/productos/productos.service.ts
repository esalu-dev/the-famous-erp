import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Producto, Prisma } from '@the-famous-erp/database-client';

@Injectable()
export class ProductosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: Prisma.ProductoCreateInput & {
      receta?: { insumoId: string; cantidad: number }[];
      imagenFileName?: string;
    },
  ): Promise<{ producto: Producto; uploadUrl: string }> {
    if (!data.nombre || data.nombre.trim() === '')
      throw new BadRequestException('El nombre del producto es obligatorio');
    if (!data.categoria || data.categoria.trim() === '')
      throw new BadRequestException('Debes seleccionar una categoría para el producto');
    if (data.precioVenta === undefined || data.precioVenta === null || data.precioVenta === '')
      throw new BadRequestException('Debes ingresar un precio de venta para este producto');

    try {
      const { receta, imagenFileName, ...datosProducto } = data;

      let fileData = {
        uploadUrl: '',
        finalFileUrl: '',
      };
      if (imagenFileName) {
        const res = await fetch(
          `${process.env.MEDIA_SERVICE_URL}/media/upload-url/${imagenFileName}`,
        );
        fileData = await res.json();
      }

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

      const dbResult = await this.prismaService.producto.create({
        data: {
          nombre: datosProducto.nombre,
          categoria: datosProducto.categoria,
          precioVenta: datosProducto.precioVenta,
          imagenUrl: fileData.finalFileUrl || null,
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

      return {
        producto: dbResult,
        uploadUrl: fileData.uploadUrl,
      };
    } catch (error) {
      throw new BadRequestException('Error al crear el producto: ' + error);
    }
  }

  async findAll(categoria?: string, activoStr?: string, incluirRecetaStr?: string) {
    try {
      const whereFilters: Prisma.ProductoWhereInput = {};

      if (categoria) {
        whereFilters.categoria = categoria;
      }

      if (activoStr !== undefined) {
        whereFilters.activo = activoStr == 'true';
      }

      let includeQuery: Prisma.ProductoInclude | undefined = undefined;
      if (incluirRecetaStr === 'true') {
        includeQuery = {
          receta: {
            include: {
              insumo: {
                select: {
                  nombre: true,
                  unidadMedida: true,
                  precioActual: true,
                },
              },
            },
          },
        };
      }

      return await this.prismaService.producto.findMany({
        where: whereFilters,
        include: includeQuery,
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener los productos: ' + error);
    }
  }

  async update(
    id: string,
    data: Prisma.ProductoUpdateInput & {
      receta?: { insumoId: string; cantidad: number }[];
      imagenFileName?: string;
    },
  ) {
    try {
      const productoAnterior = await this.prismaService.producto.findUnique({
        where: { id },
      });

      const { receta, imagenFileName, ...datosProducto } = data;

      let fileData = {
        uploadUrl: '',
        finalFileUrl: '',
      };
      if (imagenFileName) {
        const res = await fetch(
          `${process.env.MEDIA_SERVICE_URL}/media/upload-url/${imagenFileName}`,
        );
        fileData = await res.json();
      }

      const updateData: any = {
        ...datosProducto,
      };

      if (fileData.finalFileUrl) {
        updateData.imagenUrl = fileData.finalFileUrl;
      }

      if (receta && Array.isArray(receta)) {
        const esBebida = datosProducto.categoria === 'Bebida';

        const recetaFinal = receta.map((item) => ({
          insumoId: item.insumoId,
          cantidad: esBebida ? 1.0 : item.cantidad,
        }));

        updateData.receta = {
          deleteMany: {},
          createMany: {
            data: recetaFinal,
          },
        };
      }

      const dbResult = await this.prismaService.producto.update({
        where: { id },
        data: updateData,
        include: {
          receta: true,
        },
      });

      // delete previous image if a new one was uploaded
      if (fileData.finalFileUrl && productoAnterior?.imagenUrl) {
        try {
          await fetch(`${process.env.MEDIA_SERVICE_URL}/media/file`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileUrl: productoAnterior.imagenUrl }),
          });
        } catch (e) {
          console.error('Error deleting previous product image:', e);
        }
      }

      return {
        producto: dbResult,
        uploadUrl: fileData.uploadUrl,
      };
    } catch (error) {
      if (error === 'P2025') {
        throw new BadRequestException(`No se encontró el producto con ID: ${id}`);
      }
      throw new BadRequestException('Error al actualizar el producto: ' + error);
    }
  }

  async findOne(id: string) {
    const producto = await this.prismaService.producto.findUnique({
      where: { id },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prismaService.producto.update({
      where: { id },
      data: { activo: false },
    });
  }
}
