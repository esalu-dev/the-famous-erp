/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, ConflictException } from '@nestjs/common';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { FileDataResponseDto } from './dto/fileData-response.dto';

@Injectable()
export class InsumosService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const insumo = await this.prisma.insumo.findUnique({
      where: { id },
      include: {
        proveedores: true,
      },
    });
    if (!insumo) return null;
    return {
      ...insumo,
      proveedorId: insumo.proveedores?.[0]?.proveedorId || undefined,
    };
  }

  async findAll() {
    const insumos = await this.prisma.insumo.findMany({
      include: {
        proveedores: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
    return insumos.map((insumo) => ({
      ...insumo,
      proveedorId: insumo.proveedores?.[0]?.proveedorId || undefined,
    }));
  }

  async create(dto: CreateInsumoDto) {
    let fileData: FileDataResponseDto = {
      uploadUrl: '',
      finalFileUrl: '',
    };
    if (dto.imagenFileName) {
      const res = await fetch(
        `${process.env.MEDIA_SERVICE_URL}/media/upload-url/${dto.imagenFileName}`,
      );
      fileData = (await res.json()) as FileDataResponseDto;
    }

    const proveedorId = dto.proveedorId;
    delete dto.proveedorId;
    delete dto.imagenFileName;

    const dbResult = await this.prisma.insumo.create({
      data: {
        ...dto,
        imagenUrl: fileData.finalFileUrl,
      },
    });

    if (proveedorId) {
      await this.prisma.insumoProveedor.create({
        data: {
          insumoId: dbResult.id,
          proveedorId: proveedorId,
          precioUnitario: dbResult.precioActual,
          esPreferido: true,
        },
      });
    }

    return {
      insumo: {
        ...dbResult,
        proveedorId: proveedorId || undefined,
      },
      uploadUrl: fileData.uploadUrl,
    };
  }

  async update(id: string, dto: UpdateInsumoDto) {
    // Obtener el insumo antes de actualizar para saber si tenía una imagen previa
    const insumoAnterior = await this.prisma.insumo.findUnique({
      where: { id },
    });

    let fileData: FileDataResponseDto | null = null;
    if (dto.imagenFileName) {
      const res = await fetch(
        `${process.env.MEDIA_SERVICE_URL}/media/upload-url/${dto.imagenFileName}`,
      );
      fileData = (await res.json()) as FileDataResponseDto;
    }

    const proveedorId = dto.proveedorId;
    delete dto.proveedorId;
    delete dto.imagenFileName;

    const dataToUpdate: any = { ...dto };
    if (fileData) {
      dataToUpdate.imagenUrl = fileData.finalFileUrl;
    }

    const dbResult = await this.prisma.insumo.update({
      where: { id },
      data: dataToUpdate,
    });

    if (proveedorId !== undefined) {
      await this.prisma.insumoProveedor.deleteMany({
        where: { insumoId: id },
      });
      if (proveedorId) {
        await this.prisma.insumoProveedor.create({
          data: {
            insumoId: id,
            proveedorId: proveedorId,
            precioUnitario: dbResult.precioActual,
            esPreferido: true,
          },
        });
      }
    }

    // Si se generó una nueva imagen y existía una imagen previa, borrar la previa del bucket para no acumular basura
    if (fileData && insumoAnterior?.imagenUrl) {
      try {
        await fetch(`${process.env.MEDIA_SERVICE_URL}/media/file`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileUrl: insumoAnterior.imagenUrl }),
        });
      } catch (error) {
        console.error('Error al eliminar la imagen anterior del bucket:', error);
      }
    }

    return {
      insumo: {
        ...dbResult,
        proveedorId: proveedorId || undefined,
      },
      uploadUrl: fileData?.uploadUrl || '',
    };
  }

  async resurtir(
    id: string,
    dto: { cantidad: number; proveedorId: string; precioUnitario?: number },
  ) {
    const { cantidad, proveedorId, precioUnitario } = dto;

    const insumoAnterior = await this.prisma.insumo.findUnique({
      where: { id },
    });

    const updateData: any = {
      cantidadActual: {
        increment: cantidad,
      },
    };
    if (precioUnitario !== undefined && precioUnitario !== null) {
      updateData.precioActual = precioUnitario;
    }

    const dbResult = await this.prisma.insumo.update({
      where: { id },
      data: updateData,
    });

    if (proveedorId) {
      await this.prisma.insumoProveedor.deleteMany({
        where: { insumoId: id },
      });
      await this.prisma.insumoProveedor.create({
        data: {
          insumoId: id,
          proveedorId: proveedorId,
          precioUnitario: precioUnitario !== undefined ? precioUnitario : dbResult.precioActual,
          esPreferido: true,
        },
      });
    }

    if (precioUnitario !== undefined && precioUnitario !== null && insumoAnterior) {
      const firstUser = await this.prisma.usuario.findFirst();
      if (firstUser) {
        await this.prisma.precioHistorial.create({
          data: {
            insumoId: id,
            precioAnterior: insumoAnterior.precioActual,
            precioNuevo: precioUnitario,
            usuarioId: firstUser.id,
          },
        });
      }
    }

    return {
      insumo: {
        ...dbResult,
        proveedorId: proveedorId || undefined,
      },
    };
  }

  async delete(id: string) {
    try {
      // Obtener el insumo antes de eliminar para saber si tiene imagen asociada
      const insumo = await this.prisma.insumo.findUnique({
        where: { id },
      });

      const dbResult = await this.prisma.insumo.delete({
        where: { id },
      });

      // Si el insumo tenía imagen, borrarla del bucket
      if (insumo?.imagenUrl) {
        try {
          await fetch(`${process.env.MEDIA_SERVICE_URL}/media/file`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileUrl: insumo.imagenUrl }),
          });
        } catch (error) {
          console.error('Error al eliminar la imagen del insumo eliminado del bucket:', error);
        }
      }

      return dbResult;
    } catch (error) {
      const prismaError = error as { code?: string };
      if (prismaError?.code === 'P2003') {
        throw new ConflictException(
          'No se puede eliminar el insumo porque está asociado a recetas, mermas o proveedores activos.',
        );
      }
      throw error;
    }
  }
}
