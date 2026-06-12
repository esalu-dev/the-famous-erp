'use client';

import { useState } from 'react';
import { Plus } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { InsumoCard } from './insumoCard';
import { InsumoForm } from './InsumoForm';
import { ResurtirModal } from './ResurtirModal';
import { CategoryTags } from './categoriaTags';
import { type Insumo } from '@/actions/insumos.actions';

interface InsumosGridProps {
  insumos: Insumo[];
}

export function InsumosGrid({ insumos }: InsumosGridProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isResurtirOpen, setIsResurtirOpen] = useState(false);
  const [insumoAEditar, setInsumoAEditar] = useState<Insumo | null>(null);
  const [insumoAResurtir, setInsumoAResurtir] = useState<Insumo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'Comida', label: 'Comida' },
    { id: 'Bebida', label: 'Bebidas' },
    { id: 'Cerveza', label: 'Cerveza' },
    { id: 'Empaque', label: 'Empaque' },
    { id: 'Limpieza', label: 'Limpieza' },
    { id: 'Utensilios', label: 'Utensilios' },
    { id: 'Papeleria', label: 'Papelería' },
  ];

  const handleEdit = (insumo: Insumo) => {
    setInsumoAEditar(insumo);
    setIsOpen(true);
  };

  const handleResurtir = (insumo: Insumo) => {
    setInsumoAResurtir(insumo);
    setIsResurtirOpen(true);
  };

  const handleAdd = () => {
    setInsumoAEditar(null);
    setIsOpen(true);
  };

  const filteredInsumos = selectedCategory === 'all'
    ? insumos
    : insumos.filter((insumo) => insumo.tipo === selectedCategory);

  return (
    <>
      <div className="mt-6">
        <CategoryTags
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {filteredInsumos.length === 0 ? (
        <div className="text-sm text-muted italic p-4 bg-surface-secondary rounded-xl border border-neutral-200 dark:border-neutral-800 mt-6">
          No hay insumos en esta categoría.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {filteredInsumos.map((insumo) => (
            <InsumoCard
              key={insumo.id}
              titulo={insumo.nombre}
              categoria={insumo.categoria}
              precio={insumo.precioActual}
              stock={insumo.cantidadActual}
              unidad={insumo.unidadMedida}
              imagenUrl={insumo.imagenUrl}
              cantidadMinima={insumo.cantidadMinima}
              onEdit={() => handleEdit(insumo)}
              onResurtir={() => handleResurtir(insumo)}
            />
          ))}
        </div>
      )}

      <Button
        isIconOnly
        size="lg"
        className="fixed right-6 bottom-6 z-50 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
        onPress={handleAdd}
      >
        <Plus className="size-6" />
      </Button>

      {isOpen && (
        <InsumoForm
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          insumoAEditar={insumoAEditar}
        />
      )}

      {isResurtirOpen && insumoAResurtir && (
        <ResurtirModal
          insumo={insumoAResurtir}
          isOpen={isResurtirOpen}
          onOpenChange={setIsResurtirOpen}
        />
      )}
    </>
  );
}
