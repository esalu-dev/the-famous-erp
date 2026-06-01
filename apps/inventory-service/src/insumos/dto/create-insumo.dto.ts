import { CategoriaABC, InsumoTipo, UnidadMedida } from '@the-famous-erp/database-client';

export class CreateInsumoDto {
  nombre!: string;
  tipo!: InsumoTipo;
  unidadMedida!: UnidadMedida;

  cantidadActual!: number;
  cantidadMinima!: number;
  precioActual!: number;

  categoria!: CategoriaABC;
  imagenFileName?: string;
}
