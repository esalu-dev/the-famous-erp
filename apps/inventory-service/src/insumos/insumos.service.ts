import { Injectable, ConflictException } from '@nestjs/common';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { FileDataResponseDto } from './dto/fileData-response.dto';

@Injectable()
export class InsumosService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    return await this.prisma.insumo.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return await this.prisma.insumo.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async create(dto: CreateInsumoDto) {
    const res = await fetch(
      `${process.env.MEDIA_SERVICE_URL}/media/upload-url/${dto.imagenFileName}`,
    );
    const fileData: FileDataResponseDto = (await res.json()) as FileDataResponseDto;
    console.log('URL de subida obtenida:', fileData);
    const dbResult = await this.prisma.insumo.create({
      data: {
        ...dto,
        imagenUrl: fileData.finalFileUrl,
      },
    });
    return {
      insumo: dbResult,
      uploadUrl: fileData.uploadUrl,
    };
  }

  async update(id: string, dto: UpdateInsumoDto) {
    return await this.prisma.insumo.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async delete(id: string) {
    try {
      return await this.prisma.insumo.delete({
        where: { id },
      });
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
