import { Controller, Body, Post, Get, Query, Patch, Param} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { Prisma } from '@the-famous-erp/database-client';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  async create(
    @Body()
    data: Prisma.ProductoCreateInput & {
      receta?: { insumoId: string; cantidad: number }[];
    },
  ) {
    return this.productosService.create(data);
  }

  @Get()
  async findAll(
    @Query('categoria') categoria?: string,
    @Query('activo') activo?: string,
    @Query('incluirReceta') incluirReceta?: string,
  ) {
    return this.productosService.findAll(categoria, activo, incluirReceta);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    data: Prisma.ProductoUpdateInput & {
      receta?: { insumoId: string; cantidad: number }[];
    },
  ) {
    return this.productosService.update(id, data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }
}
