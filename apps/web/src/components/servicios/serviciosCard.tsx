import { Button, Card, Chip } from '@heroui/react';
import { Rectangles4, Pencil } from '@gravity-ui/icons';
import { Calendar } from '@gravity-ui/icons';

export function ServiciosCard({
  servicio,
  periodicidad,
  estado,
  costo,
  proximoPago,
  notas,
}: {
  servicio: string;
  periodicidad: string;
  estado: 'Vigente' | 'Vencido';
  costo: number;
  proximoPago: Date;
  notas: string;
}) {
  const categoryStyles = {
    Vigente: {
      color: 'success',
      variant: 'soft',
    },
    Vencido: {
      color: 'danger',
      variant: 'soft',
    },
  } as const;
  return (
    <>
      <Card className="w-full h-fit overflow-hidden">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-start gap-4">
            <div className="w-fit h-fit overflow-hidden rounded-2xl bg-accent-soft-hover p-4">
              <Rectangles4 className="text-accent size-5" />
            </div>
            <div className="flex flex-col">
              <Card.Title className="font-bold text-base">{servicio}</Card.Title>
              <span className="text-xs text-gray-600">{periodicidad}</span>
            </div>
            <div className="ml-auto">
              <Chip
                size="md"
                color={categoryStyles[estado].color}
                variant={categoryStyles[estado].variant}
              >
                {estado}
              </Chip>
            </div>
          </div>
          <Card.Footer className="mt-auto flex w-full flex-col items-start gap-3 p-0">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-surface-foreground">${costo}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-600" />
              <span className="text-sm text-gray-600">{proximoPago.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{notas}</span>
            </div>
            <Button className="w-full">
              <Pencil />
              Actualizar
            </Button>
          </Card.Footer>
        </div>
      </Card>
    </>
  );
}
