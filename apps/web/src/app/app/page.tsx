import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { getInsumosAction } from '@/actions/insumos.actions';
import { getServiciosAction } from '@/actions/servicios.actions';
import { getHistoricoVentasAction } from '@/actions/cierre.actions';
import { getPrecioHistorialAction } from '@/actions/precios.actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inicio',
};

export default async function HomePage() {
  const [insumosRes, serviciosRes, ventasRes, preciosRes] = await Promise.all([
    getInsumosAction(),
    getServiciosAction(),
    getHistoricoVentasAction(),
    getPrecioHistorialAction(),
  ]);

  return (
    <div className="w-full">
      <h1 className="font-bold text-3xl text-accent">Inicio</h1>
      <p className="text-gray-600 text-xs mt-2 mb-6">
        Análisis financiero, control de inventario crítico y gestión de costos recurrentes
      </p>

      <DashboardClient
        insumos={insumosRes.data || []}
        servicios={serviciosRes.data || []}
        ventas={ventasRes.data || []}
        precioHistorial={preciosRes.data || []}
      />
    </div>
  );
}
