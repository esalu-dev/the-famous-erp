'use client';

import { useState } from 'react';
import { Plus } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { ComparadorCard } from './comparadorCard';
import { ProveedorCard } from './proveedorCard';
import { ProveedorForm } from './ProveedorForm';
import { type Proveedor } from '@/actions/proveedores.actions';
import { type Insumo } from '@/actions/insumos.actions';
import { type PrecioHistorialEntry } from '@/actions/precios.actions';

interface ProveedoresGridProps {
  proveedores: Proveedor[];
  insumos: Insumo[];
  historialPrecios: PrecioHistorialEntry[];
}

export function ProveedoresGrid({ proveedores, insumos, historialPrecios }: ProveedoresGridProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [proveedorAEditar, setProveedorAEditar] = useState<Proveedor | null>(null);

  const handleEdit = (proveedor: Proveedor) => {
    setProveedorAEditar(proveedor);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setProveedorAEditar(null);
    setIsOpen(true);
  };

  return (
    <>
      <div className="mt-6">
        <ComparadorCard insumos={insumos} historialPrecios={historialPrecios} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
        {proveedores.map((proveedor) => (
          <ProveedorCard
            key={proveedor.id}
            proveedor={proveedor}
            onEdit={() => handleEdit(proveedor)}
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
        <ProveedorForm
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          proveedorAEditar={proveedorAEditar}
        />
      )}
    </>
  );
}
