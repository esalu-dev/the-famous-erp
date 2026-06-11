import { CategoryTags } from '@/components/insumos/categoriaTags';
import { InsumosGrid } from '@/components/insumos/InsumosGrid';
import { getInsumosAction } from '@/actions/insumos.actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insumos',
};

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

      <InsumosGrid insumos={insumos.data || []} />
    </div>
  );
}
