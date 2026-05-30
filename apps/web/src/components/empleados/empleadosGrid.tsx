import { EmpleadosCard } from './empleadosCard';

export function EmpleadosGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      <EmpleadosCard
        nombre="John Doe"
        rol="Operador"
        estado="Activo"
        correo="john.doe@example.com"
      />
      <EmpleadosCard
        nombre="Jane Smith"
        rol="Administrador"
        estado="Inactivo"
        correo="jane.smith@example.com"
      />
      <EmpleadosCard
        nombre="Bob Johnson"
        rol="Operador"
        estado="Activo"
        correo="bob.johnson@example.com"
      />
    </div>
  );
}
