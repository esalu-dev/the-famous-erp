import { FilterTags } from '@/components/productos/filtrosTags';
import { ProductosGrid } from '@/components/productos/productosGrid';

export default function ProductosPage() {
  const categories = [
    {
      id: 'pizzas',
      label: 'Pizzas',
    },
    {
      id: 'complements',
      label: 'Complementos',
    },
    {
      id: 'beverages',
      label: 'Bebidas',
    },
  ];

  return (
    <div>
      <h1 className="font-bold text-3xl text-accent">Productos</h1>
      <p className="text-gray-600 text-xs mt-2">
        Gestión de inventario maestro y análisis de rentabilidad por plato.
      </p>
      <div className="mt-6">
        <FilterTags categories={[{ id: 'all', label: 'Todos' }, ...categories]} />
      </div>
      {categories.map((category) => (
        <section key={category.id} className="mt-8">
          <div className="flex items-center gap-4 mb-4">
            <h4 className="text-xl font-bold text-accent">{category.label}</h4>
          </div>
          <ProductosGrid />
        </section>
      ))}
    </div>
  );
}
