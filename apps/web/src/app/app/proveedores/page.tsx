import { ProveedoresGrid } from '@/components/proveedores/proveedoresGrid';
import { getProveedoresAction } from '@/actions/proveedores.actions';

export default async function ProveedoresPage() {
  const proveedores = await getProveedoresAction();

  return (
    <div>
      <h1 className="font-bold text-3xl text-accent">Proveedores</h1>
      <p className="text-gray-600 text-xs mt-2">
        Gestión de relaciones y desempeño de proveedores para asegurar calidad y entrega oportuna
      </p>
      <ProveedoresGrid proveedores={proveedores.data || []} />
    </div>
  );
}