import { AddEmpleadoButton } from '@/components/empleados/addEmpleadoButton';

export default function EmpleadosPage() {
  return (
    <div>
      <h1 className="font-bold text-3xl text-accent">Empleados</h1>
      <p className="text-gray-600 text-xs mt-2">
        Gestión de personal, asignación de roles y control de accesos al sistema
      </p>

      <AddEmpleadoButton />
    </div>
  );
}
