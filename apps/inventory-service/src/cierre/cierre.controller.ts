import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { CierreService } from './cierre.service';

@Controller('cierre')
export class CierreController {
  constructor(private readonly cierreService: CierreService) {}

  @Get('status')
  async getStatus(@Query('fecha') fecha: string) {
    if (!fecha) throw new BadRequestException('La fecha es requerida');
    return this.cierreService.getStatus(fecha);
  }

  @Get('ventas')
  async getVentas(@Query('fecha') fecha: string) {
    if (!fecha) throw new BadRequestException('La fecha es requerida');
    return this.cierreService.getVentas(fecha);
  }

  @Post('ventas')
  async registrarVentas(
    @Body()
    body: {
      fecha: string;
      registradoPor: string;
      ventas: { productoId: string; cantidad: number }[];
    },
  ) {
    if (!body.fecha) throw new BadRequestException('La fecha es requerida');
    if (!body.registradoPor)
      throw new BadRequestException('El usuario (registradoPor) es requerido');
    if (!body.ventas || !Array.isArray(body.ventas))
      throw new BadRequestException('El arreglo de ventas es requerido');
    return this.cierreService.registrarVentas(body.fecha, body.registradoPor, body.ventas);
  }

  @Post('procesar')
  async procesarCierre(@Body() body: { fecha: string }) {
    if (!body.fecha) throw new BadRequestException('La fecha es requerida');
    return this.cierreService.procesarCierre(body.fecha);
  }
}
