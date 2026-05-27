'use client';

import { useState } from 'react';
import { Plus } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { InsumoCard } from './insumoCard';
import { InsumoForm } from './InsumoForm';
import { type Insumo } from '@/actions/insumos.actions';

interface InsumosGridProps {
  insumos: Insumo[];
}

export function InsumosGrid({ insumos }: InsumosGridProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [insumoAEditar, setInsumoAEditar] = useState<Insumo | null>(null);

  const handleEdit = (insumo: Insumo) => {
    setInsumoAEditar(insumo);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setInsumoAEditar(null);
    setIsOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {insumos.map((insumo) => (
          <InsumoCard
            key={insumo.id}
            titulo={insumo.nombre}
            categoria={insumo.categoria}
            precio={insumo.precioActual}
            stock={insumo.cantidadActual}
            unidad={insumo.unidadMedida}
            imagenUrl={insumo.imagenUrl}
            onEdit={() => handleEdit(insumo)}
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

      <InsumoForm
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        insumoAEditar={insumoAEditar}
      />
    </>
  );
}
