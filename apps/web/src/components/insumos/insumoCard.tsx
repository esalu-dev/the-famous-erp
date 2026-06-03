import { Button, Card, Chip } from '@heroui/react';
import { Pencil, TriangleExclamation } from '@gravity-ui/icons';

export function InsumoCard({
  titulo,
  categoria,
  precio,
  stock,
  unidad,
  imagenUrl,
  cantidadMinima,
  onEdit,
  onResurtir,
}: {
  titulo?: string;
  categoria?: 'A' | 'B' | 'C';
  precio?: number;
  stock?: number;
  unidad?: string;
  imagenUrl?: string | null;
  cantidadMinima?: number;
  onEdit?: () => void;
  onResurtir?: () => void;
}) {
  const esBajoStock = stock !== undefined && cantidadMinima !== undefined && Number(stock) < Number(cantidadMinima);

  // Formatear unidad y cantidades para mejor lectura del usuario
  let unidadDisplay = unidad;
  let stockDisplay = stock !== undefined ? Number(stock) : 0;
  let minDisplay = cantidadMinima !== undefined ? Number(cantidadMinima) : 0;

  if (unidad === 'Gramos') {
    if (stockDisplay >= 1000) {
      stockDisplay = stockDisplay / 1000;
      minDisplay = minDisplay / 1000;
      unidadDisplay = 'kg';
    } else {
      unidadDisplay = 'g';
    }
  } else if (unidad === 'Mililitros') {
    if (stockDisplay >= 1000) {
      stockDisplay = stockDisplay / 1000;
      minDisplay = minDisplay / 1000;
      unidadDisplay = 'L';
    } else {
      unidadDisplay = 'ml';
    }
  } else if (unidad === 'Miligramos') {
    unidadDisplay = 'mg';
  } else if (unidad === 'Piezas') {
    unidadDisplay = 'pz';
  }

  let precioUnidadLabel = '';
  if (unidad === 'Gramos') {
    precioUnidadLabel = '/ g';
  } else if (unidad === 'Mililitros') {
    precioUnidadLabel = '/ ml';
  } else if (unidad === 'Miligramos') {
    precioUnidadLabel = '/ mg';
  } else if (unidad === 'Piezas') {
    precioUnidadLabel = '/ pz';
  }

  const categoryStyles = {
    A: {
      color: 'danger',
      variant: 'soft',
    },
    B: {
      color: 'warning',
      variant: 'soft',
    },
    C: {
      color: 'success',
      variant: 'soft',
    },
  } as const;

  return (
    <Card className={`w-full h-120 overflow-hidden transition-all duration-200 ${esBajoStock ? 'border-2 border-danger shadow-md shadow-danger/5' : 'border border-transparent'}`}>
      <div className="relative w-full h-56 overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Cherries"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          src={imagenUrl || 'https://blocks.astratic.com/img/general-img-landscape.png'}
        />
        {esBajoStock && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-danger text-danger-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
            <TriangleExclamation className="size-3.5" />
            Stock Bajo
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Card.Header className="gap-3 p-0">
          <div className="flex items-center justify-between w-full">
            <Card.Title className="pr-8 font-bold text-base">{titulo}</Card.Title>
            <span className="font-bold flex items-baseline gap-0.5">
              ${precio}
              {precioUnidadLabel && (
                <span className="text-xs text-muted font-normal">{precioUnidadLabel}</span>
              )}
            </span>
          </div>
          <Chip
            size="md"
            color={categoria ? categoryStyles[categoria].color : categoryStyles.A.color}
            variant={categoria ? categoryStyles[categoria].variant : categoryStyles.A.variant}
            className="rounded-full w-fit"
          >
            Categoría {categoria}
          </Chip>
        </Card.Header>
        <Card.Footer className="mt-auto flex w-full flex-col items-start gap-3 p-0">
          <div className="gap-1">
            <span className="text-xs text-muted">Stock Actual</span>
            <div className={`text-sm font-semibold flex items-center gap-1.5 ${esBajoStock ? 'text-danger' : ''}`}>
              <span>{stockDisplay}</span> <span>{unidadDisplay}</span>
              {esBajoStock && (
                <span className="text-[10px] text-danger/80 font-normal">
                  (Mínimo: {minDisplay} {unidadDisplay})
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onPress={onResurtir}>
              Resurtir
            </Button>
            <Button variant="secondary" isIconOnly onPress={onEdit} className="border border-neutral-200 dark:border-neutral-800">
              <Pencil className="size-4" />
            </Button>
          </div>
        </Card.Footer>
      </div>
    </Card>
  );
}
