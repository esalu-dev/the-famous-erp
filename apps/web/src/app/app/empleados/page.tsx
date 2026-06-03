import { EmpleadosGrid } from '@/components/empleados/empleadosGrid';
import { getEmpleadosAction } from '@/actions/empleados.actions';

export default async function EmpleadosPage() {
  const res = await getEmpleadosAction();
  const empleados = res.success ? res.data : [];

  return (
    <div>
      <h1 className="font-bold text-3xl text-accent">Empleados</h1>
      <p className="text-gray-600 text-xs mt-2">
        Gestión de personal, asignación de roles y control de accesos al sistema
      </p>

      <EmpleadosGrid empleados={empleados} />
    </div>
  );
}
