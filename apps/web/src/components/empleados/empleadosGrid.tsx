'use client';

import { useState } from 'react';
import { Plus } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { EmpleadosCard } from './empleadosCard';
import { EmpleadoForm } from './empleadoForm';
import { type Empleado } from '@/actions/empleados.actions';

interface EmpleadosGridProps {
  empleados: Empleado[];
}

export function EmpleadosGrid({ empleados }: EmpleadosGridProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [empleadoAEditar, setEmpleadoAEditar] = useState<Empleado | null>(null);

  const handleEdit = (empleado: Empleado) => {
    setEmpleadoAEditar(empleado);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEmpleadoAEditar(null);
    setIsOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {empleados.map((empleado) => (
          <EmpleadosCard
            key={empleado.id}
            empleado={empleado}
            onEdit={() => handleEdit(empleado)}
          />
        ))}
      </div>

      <Button
        isIconOnly
        size="lg"
        className="fixed right-6 bottom-6 z-50 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
        onPress={handleAdd}
      >
        <Plus className="size-6" />
      </Button>

      {isOpen && (
        <EmpleadoForm
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          empleadoAEditar={empleadoAEditar}
        />
      )}
    </>
  );
}
