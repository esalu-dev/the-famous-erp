import { Button, Card, Chip } from '@heroui/react';
import { Pencil } from '@gravity-ui/icons';

export function InsumoCard({
  titulo,
  categoria,
  precio,
  stock,
  unidad,
  imagenUrl,
  onEdit,
}: {
  titulo?: string;
  categoria?: 'A' | 'B' | 'C';
  precio?: number;
  stock?: number;
  unidad?: string;
  imagenUrl?: string | null;
  onEdit?: () => void;
}) {
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
    <Card className="w-full h-100 overflow-hidden">
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Cherries"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          src={
            imagenUrl ||
            'https://recetaselite.com/wp-content/uploads/2023/12/20260316_2106_Image-Generation_simple_compose_01kkw426e2fbg8zd871vtwv3qe.png'
          }
        />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <Card.Header className="gap-3">
          <div className="flex items-center justify-between w-full">
            <Card.Title className="pr-8 font-bold text-base">{titulo}</Card.Title>
            <span className="font-bold">${precio}</span>
          </div>
          <Chip
            size="md"
            color={categoria ? categoryStyles[categoria].color : categoryStyles.A.color}
            variant={categoria ? categoryStyles[categoria].variant : categoryStyles.A.variant}
            className="rounded-full font-bold w-fit"
          >
            Categoría {categoria}
          </Chip>
        </Card.Header>
        <Card.Footer className="mt-auto flex w-full flex-col items-start gap-3">
          <div className="gap-1">
            <span className="text-xs text-muted">Stock Actual</span>
            <div className="justify-between text-sm font-semibold">
              <span>{stock}</span> <span>{unidad} </span>
            </div>
          </div>
          <Button className="w-full" onPress={onEdit}>
            <Pencil />
            Actualizar
          </Button>
        </Card.Footer>
      </div>
    </Card>
  );
}
