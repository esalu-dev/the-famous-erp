import { FilterTags } from '@/components/productos/filtrosTags';
import { ProductosGrid } from '@/components/productos/productosGrid';

export default function ProductosPage() {
  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'pizzas', label: 'Pizzas' },
    { id: 'complements', label: 'Complementos' },
    { id: 'beverages', label: 'Bebidas' },
  ];
  return (
    <div>
      <h1 className="font-bold text-3xl text-accent">Productos</h1>
      <p className="text-gray-600 text-xs mt-2">
        Gestión de inventario maestro y análisis de rentabilidad por plato.
      </p>
      <div className="mt-6">
        <FilterTags categories={categories} />
      </div>
      <ProductosGrid />
    </div>
  );
}
