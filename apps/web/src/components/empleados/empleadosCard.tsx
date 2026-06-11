import { Pencil, Person, Envelope, Shield } from '@gravity-ui/icons';
import { Button, Card, Chip } from '@heroui/react';
import { type Empleado } from '@/actions/empleados.actions';
import { useAuth } from '@/components/auth/AuthProvider';

interface EmpleadosCardProps {
  empleado: Empleado;
  onEdit: () => void;
}

export function EmpleadosCard({ empleado, onEdit }: EmpleadosCardProps) {
  const { nombre, correo, rol, activo } = empleado;
  const { user } = useAuth();

  const isCurrentUser = user?.id === empleado.id;

  const rolStyles = {
    admin: {
      color: 'accent',
      variant: 'soft',
      label: 'Administrador',
    },
    operador: {
      color: 'default',
      variant: 'soft',
      label: 'Operador',
    },
  } as const;

  const currentRol = (rol === 'admin' ? 'admin' : 'operador') as 'admin' | 'operador';

  return (
    <Card className="w-full h-fit overflow-hidden">
      <div className="flex flex-col gap-4 p-4">
        {/* Header section with Name and Status */}
        <div className="flex items-start gap-4">
          <div className="w-fit h-fit overflow-hidden rounded-2xl bg-accent-soft-hover p-4 text-accent">
            <Person className="size-5" />
          </div>
          <div className="flex flex-col">
            <Card.Title className="font-bold text-base flex items-center gap-1.5">
              {nombre}
              {isCurrentUser && (
                <Chip size="sm" color="warning" variant="soft" className="h-5 text-[10px] font-bold px-1.5">
                  Tú
                </Chip>
              )}
            </Card.Title>
            <span className="text-xs text-gray-600 mt-0.5">{correo}</span>
          </div>
          <div className="ml-auto">
            <Chip
              size="md"
              color={activo ? 'success' : 'default'}
              variant="soft"
            >
              {activo ? 'Activo' : 'Inactivo'}
            </Chip>
          </div>
        </div>

        {/* Footer/Details section */}
        <Card.Footer className="mt-auto flex w-full flex-col items-start gap-3 p-0">
          <div className="flex items-center gap-2">
            <Shield className="text-gray-600 size-4" />
            <span className="text-sm text-gray-600">
              Rol: <strong className="capitalize">{rolStyles[currentRol].label}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Envelope className="text-gray-600 size-4" />
            <span className="text-sm text-gray-600">{correo}</span>
          </div>
          
          <Button
            className="w-full mt-2"
            onPress={onEdit}
            isDisabled={isCurrentUser}
          >
            <Pencil className="size-4" />
            {isCurrentUser ? 'No puedes editar tu propio usuario' : 'Actualizar Empleado'}
          </Button>
        </Card.Footer>
      </div>
    </Card>
  );
}
