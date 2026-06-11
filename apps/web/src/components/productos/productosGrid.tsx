'use client';

import { useState } from 'react';
import { Plus } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { ProductosCard } from './productosCard';
import { ProductoForm } from './ProductoForm';
import { FilterTags } from './filtrosTags';
import { type Producto } from '@/actions/productos.actions';

interface ProductosGridProps {
  productos: Producto[];
}

export function ProductosGrid({ productos }: ProductosGridProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'pizzas', label: 'Pizzas' },
    { id: 'complements', label: 'Complementos' },
    { id: 'beverages', label: 'Bebidas' },
  ];

  const handleEdit = (producto: Producto) => {
    setProductoAEditar(producto);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setProductoAEditar(null);
    setIsOpen(true);
  };

  // Group active products by category
  const pizzas = productos.filter((p) => p.categoria === 'Pizza' && p.activo !== false);
  const complements = productos.filter((p) => p.categoria === 'Complemento' && p.activo !== false);
  const beverages = productos.filter((p) => p.categoria === 'Bebida' && p.activo !== false);

  // Profit margin calculation helper
  const calculateMargin = (precioVenta: number, receta?: any[]) => {
    if (!receta || receta.length === 0) return '100% margen';
    let cost = 0;
    for (const item of receta) {
      const precioActual = Number(item.insumo?.precioActual || 0);
      const cantidad = Number(item.cantidad || 0);
      cost += precioActual * cantidad;
    }
    if (precioVenta <= 0) return '0% margen';
    const marginPercent = ((precioVenta - cost) / precioVenta) * 100;
    return `${Math.max(0, Math.round(marginPercent))}% margen`;
  };

  const renderSection = (title: string, items: Producto[]) => {
    if (items.length === 0) {
      return (
        <div className="text-sm text-muted italic p-4 bg-surface-secondary rounded-xl border border-neutral-200 dark:border-neutral-800">
          No hay productos en esta categoría.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 animate-fade-in">
        {items.map((prod) => (
          <ProductosCard
            key={prod.id}
            titulo={prod.nombre}
            precio={Number(prod.precioVenta)}
            imagenUrl={prod.imagenUrl || null}
            categoria={prod.categoria}
            margenGanancia={calculateMargin(Number(prod.precioVenta), prod.receta)}
            onEdit={() => handleEdit(prod)}
          />
        ))}
      </div>
    );
  };

  // Filter sections to render
  const showAll = selectedCategory === 'all';
  const showPizzas = showAll || selectedCategory === 'pizzas';
  const showComplements = showAll || selectedCategory === 'complements';
  const showBeverages = showAll || selectedCategory === 'beverages';

  return (
    <>
      <div className="mt-6">
        <FilterTags
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="flex flex-col gap-8">
        {showPizzas && (
          <section className="mt-8">
            <h4 className="text-xl font-bold text-accent mb-4 border-b border-neutral-100 dark:border-neutral-900 pb-2">
              Pizzas
            </h4>
            {renderSection('Pizzas', pizzas)}
          </section>
        )}

        {showComplements && (
          <section className="mt-8">
            <h4 className="text-xl font-bold text-accent mb-4 border-b border-neutral-100 dark:border-neutral-900 pb-2">
              Complementos
            </h4>
            {renderSection('Complementos', complements)}
          </section>
        )}

        {showBeverages && (
          <section className="mt-8">
            <h4 className="text-xl font-bold text-accent mb-4 border-b border-neutral-100 dark:border-neutral-900 pb-2">
              Bebidas
            </h4>
            {renderSection('Bebidas', beverages)}
          </section>
        )}
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
        <ProductoForm
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          productoAEditar={productoAEditar}
        />
      )}
    </>
  );
}
