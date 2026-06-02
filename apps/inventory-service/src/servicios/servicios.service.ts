import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Servicio } from '@the-famous-erp/database-client';

@Injectable()
export class ServiciosService {
  constructor(private prisma: PrismaService) {}

  async create(datos: Prisma.ServicioCreateInput): Promise<Servicio> {
    if (!datos.nombre || datos.nombre.trim() === '')
      throw new BadRequestException('El nombre del servicio es obligatorio');

    if (datos.costo === null || datos.costo === undefined || datos.costo === '')
      throw new BadRequestException('El costo del servicio es obligatorio para el registro');

    if (!datos.periodicidad)
      throw new BadRequestException('Debes especficar la periodicidad del servicio');

    if (!datos.proximoPago)
      throw new BadRequestException('Debes especficar la fecha del próximo pago del servicio');

    try {
      return await this.prisma.servicio.create({
        data: {
          ...datos,
          proximoPago: new Date(datos.proximoPago),
          activo: datos.activo !== undefined ? datos.activo : true,
        },
      });
    } catch (error: any) {
      throw new BadRequestException('Error al crear el servicio' + error);
    }
  }

  async findAll(): Promise<Servicio[]> {
    return this.prisma.servicio.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string): Promise<Servicio> {
    const servicio = await this.prisma.servicio.findUnique({
      where: { id },
    });

    if (!servicio) throw new BadRequestException('Este servicio no fue encontrado');

    return servicio;
  }

  async update(id: string, datos: Prisma.ServicioUpdateInput): Promise<Servicio> {
    await this.findOne(id);

    if (
      datos.nombre !== undefined &&
      typeof datos.nombre === 'string' &&
      datos.nombre.trim() === ''
    )
      throw new BadRequestException('El nombre del servicio es obligatorio');

    if (datos.costo === null || datos.costo === undefined || datos.costo === '')
      throw new BadRequestException('El costo del servicio es obligatorio para el registro');

    if (!datos.periodicidad)
      throw new BadRequestException('Debes especficar la periodicidad del servicio');

    if (!datos.proximoPago)
      throw new BadRequestException('Debes especficar la fecha del próximo pago del servicio');

    const datosActualizados: Prisma.ServicioUpdateInput = { ...datos };

    if (datos.proximoPago) {
      const fecha = new Date(datos.proximoPago as string | Date);
      if (isNaN(fecha.getTime()))
        throw new BadRequestException('Ingresa una fecha válida para el próximo pago del servicio');
      datosActualizados.proximoPago = fecha;
    }

    try {
      return await this.prisma.servicio.update({
        where: { id },
        data: datosActualizados,
      });
    } catch (error: any) {
      throw new BadRequestException('Error al actualizar el servicio: ' + error);
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.servicio.delete({
      where: { id },
    });
  }
}
