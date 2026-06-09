import { CierreClient } from '@/components/cierre/CierreClient';
import { getProductosAction } from '@/actions/productos.actions';

export default async function CierrePage() {
  const response = await getProductosAction({ incluirReceta: true, activo: true });
  const productos = response.data || [];

  return (
    <div>
      <h1 className="font-bold text-3xl text-accent">Cierre del Día</h1>
      <p className="text-gray-600 text-xs mt-2">
        Auditoría operativa diaria, cuadre de caja y deducción automatizada de insumos de cocina.
      </p>

      <CierreClient productos={productos} />
    </div>
  );
}
