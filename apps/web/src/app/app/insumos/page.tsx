'use client';

import { useState } from 'react';
import { InsumoForm } from '@/components/insumos/InsumoForm';
import { Plus } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { InsumoCard } from '@/components/insumos/insumoCard';
import { CategoryTags } from '@/components/insumos/categoriaTags';

export default function InsumosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'protein', label: 'Proteínas' },
    { id: 'vegetables', label: 'Vegetales' },
    { id: 'dairy', label: 'Lácteos' },
    { id: 'beverages', label: 'Bebidas' },
  ];

  return (
    <div>
      <h1 className="font-bold text-3xl text-accent">Insumos</h1>
      <p className="text-gray-600 text-xs mt-2">
        Gestión de inventario y costos de insumo críticos para producción
      </p>
      <div className="mt-6">
        <CategoryTags categories={categories} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        <InsumoCard
          titulo="Pepperoni importado"
          categoria="A"
          precio={12.5}
          stock={45.0}
          unidad="kg"
        />
        <InsumoCard titulo="Insumo 2" categoria="B" precio={15.45} stock={30.0} unidad="kg" />
        <InsumoCard titulo="Insumo 3" categoria="C" precio={10.32} stock={20.0} unidad="kg" />
        <InsumoCard titulo="Insumo 4" categoria="B" precio={12.56} stock={45.0} unidad="kg" />
        <InsumoCard titulo="Insumo 5" categoria="A" precio={15.25} stock={30.0} unidad="kg" />
        <InsumoCard titulo="Insumo 6" categoria="A" precio={10.35} stock={20.0} unidad="kg" />
        <InsumoCard titulo="Insumo 7" categoria="A" precio={10.35} stock={20.0} unidad="kg" />
      </div>
      <span>
        <Button
          isIconOnly
          size="lg"
          className="fixed right-6 bottom-6"
          onPress={() => setIsModalOpen(true)}
        >
          <Plus />
        </Button>
      </span>

      <InsumoForm isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
