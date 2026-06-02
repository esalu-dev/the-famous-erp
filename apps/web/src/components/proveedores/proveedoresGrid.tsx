import { AddProveedorButton } from './AddProveedorButton';
import { ComparadorCard } from './comparadorCard';
import { ProveedorCard } from './proveedorCard';

export function ProveedoresGrid() {
  return (
    <>
      <div className="mt-6">
        <ComparadorCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
        <ProveedorCard
          nombre="Lacteos Express"
          razonSocial="Lacteos Express S.A."
          tipoProveedor="Proveedor A"
          telefono="123-456-7890"
          email="proveedor1@example.com"
          estado="Activo"
        />
        <ProveedorCard
          nombre="Lacteos Express"
          razonSocial="Lacteos Express S.A."
          tipoProveedor="Proveedor A"
          telefono="123-456-7890"
          email="proveedor1@example.com"
          estado="Inactivo"
        />
        <ProveedorCard
          nombre="Lacteos Express"
          razonSocial="Lacteos Express S.A."
          tipoProveedor="Proveedor A"
          telefono="123-456-7890"
          email="proveedor1@example.com"
          estado="Activo"
        />
      </div>
      <AddProveedorButton />
    </>
  );
}
