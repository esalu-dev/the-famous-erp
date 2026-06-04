import { Controller, Body, Post } from '@nestjs/common';
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
}
