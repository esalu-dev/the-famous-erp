import { ProveedoresGrid } from '@/components/proveedores/proveedoresGrid';
import { getProveedoresAction } from '@/actions/proveedores.actions';
import { getInsumosAction } from '@/actions/insumos.actions';
import { getPrecioHistorialAction } from '@/actions/precios.actions';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Proveedores',
};

export default async function ProveedoresPage() {
  const [proveedoresRes, insumosRes, historialRes] = await Promise.all([
    getProveedoresAction(),
    getInsumosAction(),
    getPrecioHistorialAction(),
  ]);

  const proveedores = proveedoresRes.data || [];
  const insumos = insumosRes.data || [];
  const historial = historialRes.data || [];

  return (
    <div>
      <h1 className="font-bold text-3xl text-accent">Proveedores</h1>
      <p className="text-gray-600 text-xs mt-2">
        Gestión de relaciones y desempeño de proveedores para asegurar calidad y entrega oportuna
      </p>
      <ProveedoresGrid
        proveedores={proveedores}
        insumos={insumos}
        historialPrecios={historial}
      />
    </div>
  );
}