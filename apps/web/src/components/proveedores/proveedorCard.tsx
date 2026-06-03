import { Pencil } from '@gravity-ui/icons';
import { Button, Card, Chip } from '@heroui/react';
import { Factory } from '@gravity-ui/icons';
import { Boxes3 } from '@gravity-ui/icons';
import { Handset } from '@gravity-ui/icons';
import { Envelope } from '@gravity-ui/icons';
import { type Proveedor } from '@/actions/proveedores.actions';

export function ProveedorCard({
  proveedor,
  onEdit,
}: {
  proveedor: Proveedor;
  onEdit: () => void;
}) {
  const { nombre, razonSocial, tipo, telefono, correo, estado } = proveedor;

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

  const currentEstado = (estado === 'Inactivo' ? 'Inactivo' : 'Activo') as 'Activo' | 'Inactivo';

  return (
    <Card className="w-full h-fit overflow-hidden">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-start gap-4">
          <div className="w-fit h-fit overflow-hidden rounded-2xl bg-accent-soft-hover p-4">
            <Factory className="text-accent size-5" />
          </div>
          <div className="flex flex-col">
            <Card.Title className="font-bold text-base">{nombre}</Card.Title>
            <span className="text-xs text-gray-600">{razonSocial || 'Sin razón social'}</span>
          </div>
          <div className="ml-auto">
            <Chip
              size="md"
              color={categoryStyles[currentEstado].color}
              variant={categoryStyles[currentEstado].variant}
            >
              {currentEstado}
            </Chip>
          </div>
        </div>
        <Card.Footer className="mt-auto flex w-full flex-col items-start gap-3 p-0">
          <div className="flex items-center gap-2">
            <Boxes3 className="text-gray-600"/>
            <span className="text-sm text-gray-600 capitalize">{tipo || 'Sin tipo'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Handset className="text-gray-600" />
            <span className="text-sm text-gray-600">{telefono || 'Sin teléfono'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Envelope className="text-gray-600" />
            <span className="text-sm text-gray-600">{correo || 'Sin correo electrónico'}</span>
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
