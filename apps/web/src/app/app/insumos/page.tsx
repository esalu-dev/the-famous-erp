import { InsumoCard } from '@/components/insumos/insumoCard';
import { CategoryTags } from '@/components/insumos/categoriaTags';
import { AddInsumoButton } from '@/components/insumos/AddInsumoButton';
import { getInsumosAction } from '@/actions/insumos.actions';

export default async function InsumosPage() {
  const insumos = await getInsumosAction();
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
        {insumos.data?.map((insumo) => (
          <InsumoCard
            key={insumo.id}
            titulo={insumo.nombre}
            categoria={insumo.categoria}
            precio={insumo.precioActual}
            stock={insumo.cantidadActual}
            unidad={insumo.unidadMedida}
          />
        ))}
      </div>

      <AddInsumoButton />
    </div>
  );
}
