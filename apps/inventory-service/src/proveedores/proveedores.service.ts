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

async compararPrecios(insumoId: string, cantidad: number) {

  const insumo = await this.prisma.insumo.findUnique({
    where: { id: insumoId },
  });

  if (!insumo) {
    throw new NotFoundException(`Insumo con ID ${insumoId} no encontrado`);
  }

  const proveedoresInsumo = await this.prisma.insumoProveedor.findMany({
    where: { insumoId },
    include: {
      proveedor: true, 
    },
  });

  if (proveedoresInsumo.length === 0) {
    return []; 
  }

  const comparativa = proveedoresInsumo.map((item) => {
    const precioUnitario = Number(item.precioUnitario); 
    const totalCalculado = precioUnitario * cantidad;

    return {
      proveedorId: item.proveedor.id,
      nombreProveedor: item.proveedor.nombre,
      precioUnitario,
      totalCalculado,
      esMasBarato: false, 
      datosContacto: {
        telefono: item.proveedor.telefono,
        correo: item.proveedor.correo,
      }
    };
  });

  comparativa.sort((a, b) => a.totalCalculado - b.totalCalculado);

  comparativa[0].esMasBarato = true;

  return comparativa;
}
}
