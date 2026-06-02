import { Pencil } from '@gravity-ui/icons';
import { Button, Card, Chip } from '@heroui/react';
import { Factory } from '@gravity-ui/icons';
import { Boxes3 } from '@gravity-ui/icons';
import { Handset } from '@gravity-ui/icons';
import { Envelope } from '@gravity-ui/icons';

export function ProveedorCard({
  nombre,
  razonSocial,
  tipoProveedor,
  telefono,
  email,
  estado,
}: {
  nombre: string;
  razonSocial: string;
  tipoProveedor: string;
  telefono: string;
  email: string;
  estado: 'Activo' | 'Inactivo';
}) {
  const categoryStyles = {
    Activo: {
      color: 'accent',
      variant: 'soft',
    },
    Inactivo: {
      color: 'default',
      variant: 'soft',
    },
  } as const;
  return (
    <Card className="w-full h-fit overflow-hidden">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-start gap-4">
          <div className="w-fit h-fit overflow-hidden rounded-2xl bg-accent-soft-hover p-4">
            <Factory className="text-accent size-5" />
          </div>
          <div className="flex flex-col">
            <Card.Title className="font-bold text-base">{nombre}</Card.Title>
            <span className="text-xs text-gray-600">{razonSocial}</span>
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
            <Boxes3 className="text-gray-600" />
            <span className="text-sm text-gray-600">{tipoProveedor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Handset className="text-gray-600" />
            <span className="text-sm text-gray-600">{telefono}</span>
          </div>
          <div className="flex items-center gap-2">
            <Envelope className="text-gray-600" />
            <span className="text-sm text-gray-600">{email}</span>
          </div>
          <Button className="w-full">
            <Pencil />
            Actualizar
          </Button>
        </Card.Footer>
      </div>
    </Card>
  );
}
