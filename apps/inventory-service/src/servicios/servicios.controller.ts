import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { Servicio } from '@the-famous-erp/database-client';

@Controller('servicios')
export class ServiciosController {
  constructor(private serviciosService: ServiciosService) {}

  @Post()
  async create(@Body() datos: Omit<Servicio, 'id'>) {
    return this.serviciosService.create(datos);
  }

  @Get()
  async findAll() {
    return this.serviciosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.serviciosService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() datos: Omit<Servicio, 'id'>) {
    return this.serviciosService.update(id, datos);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.serviciosService.delete(id);
  }
}
