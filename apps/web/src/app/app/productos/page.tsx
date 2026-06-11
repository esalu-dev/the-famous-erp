import { ProductosGrid } from '@/components/productos/productosGrid';
import { getProductosAction } from '@/actions/productos.actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Productos',
};

export default async function ProductosPage() {
  const response = await getProductosAction({ incluirReceta: true });
  const productos = response.data || [];

  return (
    <div>
      <h1 className="font-bold text-3xl text-accent">Productos</h1>
      <p className="text-gray-600 text-xs mt-2">
        Gestión de inventario maestro y análisis de rentabilidad por plato.
      </p>

      <ProductosGrid productos={productos} />
    </div>
  );
}
