import { PreciosClient } from '@/components/precios/PreciosClient';
import { getPrecioHistorialAction } from '@/actions/precios.actions';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Historial de Precios',
};

export default async function PreciosPage() {
  const response = await getPrecioHistorialAction();
  const historial = response.data || [];

  return (
    <div>
      <h1 className="font-bold text-3xl text-accent">Historial de Precios</h1>
      <p className="text-gray-600 text-xs mt-2">
        Monitoreo y análisis de cambios de precios en insumos.
      </p>

      <PreciosClient inicialHistorial={historial} />
    </div>
  );
}
