import { Body, Controller, Get, Post, Delete, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { InsumosService } from './insumos.service';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('insumos')
export class InsumosController {
  constructor(private readonly insumosService: InsumosService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insumosService.findOne(id);
  }

  @Get()
  findAll() {
    return this.insumosService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateInsumoDto) {
    return this.insumosService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInsumoDto,
    @Req() req: { user?: { id: string } },
  ) {
    const usuarioId = req.user?.id;
    return this.insumosService.update(id, dto, usuarioId);
  }

  @Post(':id/resurtir')
  @UseGuards(JwtAuthGuard)
  resurtir(
    @Param('id') id: string,
    @Body() dto: { cantidad: number; proveedorId: string; precioUnitario?: number },
    @Req() req: { user?: { id: string } },
  ) {
    const usuarioId = req.user?.id;
    return this.insumosService.resurtir(id, dto, usuarioId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.insumosService.delete(id);
  }
}
