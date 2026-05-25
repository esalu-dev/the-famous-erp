import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { PrismaService } from '../prisma/prisma.service'; // Ajusta la ruta según tu estructura

@Injectable()
export class ProveedoresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProveedorDto: CreateProveedorDto) {
    return this.prisma.proveedor.create({
      data: createProveedorDto,
    });
  }

  async findAll() {
    return this.prisma.proveedor.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const proveedor = await this.prisma.proveedor.findUnique({
      where: { id },
    });

    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    return proveedor;
  }

  async update(id: string, updateProveedorDto: UpdateProveedorDto) {
    await this.findOne(id);

    return this.prisma.proveedor.update({
      where: { id },
      data: updateProveedorDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.proveedor.update({
      where: { id },
      data: { estado: 'Inactivo' },
    });
  }
}
