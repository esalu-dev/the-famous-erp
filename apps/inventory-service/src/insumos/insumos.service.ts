import { Injectable } from '@nestjs/common';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
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
    return await this.prisma.insumo.create({
      data: {
        ...dto,
      },
    });
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
    return await this.prisma.insumo.delete({
      where: { id },
    });
  }
}
