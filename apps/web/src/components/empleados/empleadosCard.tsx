'use client';

import { Pencil } from '@gravity-ui/icons';
import { Avatar, Button, Card, Chip } from '@heroui/react';
import { Envelope } from '@gravity-ui/icons';
import { useAuth } from '../auth/AuthProvider';

export function EmpleadosCard({
  nombre,
  rol,
  estado,
  correo,
}: {
  nombre: string;
  rol: string;
  estado: 'Activo' | 'Inactivo';
  correo: string;
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

  const getInitials = (name?: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Card className="w-full h-fit overflow-hidden">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-start gap-4">
            <Avatar>
              <Avatar.Fallback>{getInitials(nombre)}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col">
              <Card.Title className="font-bold text-base">{nombre}</Card.Title>
              <span className="text-xs text-gray-600">{rol}</span>
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
              <Envelope className="text-gray-600" />
              <span className="text-sm text-gray-600">{correo}</span>
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
