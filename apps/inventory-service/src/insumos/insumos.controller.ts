import { Body, Controller, Get, Post, Delete, Patch, Param } from '@nestjs/common';
import { InsumosService } from './insumos.service';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';

@Controller('insumos')
export class InsumosController {

  constructor(private readonly insumosService: InsumosService) { }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insumosService.findOne(id);
  }

  @Get()
  findAll() {
    return this.insumosService.findAll();
  }


  @Post()
  create(@Body() dto: CreateInsumoDto) {
    return this.insumosService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateInsumoDto) {
    return this.insumosService.update(id, dto);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.insumosService.delete(id);
  }
}