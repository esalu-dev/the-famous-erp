import { Injectable } from '@nestjs/common';
import { CreateInsumoDto } from './dto/create-insumo.dto';

@Injectable()
export class InsumosService {

  private insumos: CreateInsumoDto[] = [];

  findAll() {
    return this.insumos.sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
  }

  create(createInsumoDto: CreateInsumoDto) {
    this.insumos.push(createInsumoDto);
    return createInsumoDto;
  }
}