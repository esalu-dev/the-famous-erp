'use client';

import { AddProveedorButton } from '@/components/proveedores/addProveedorButton';
import { ComparadorCard } from '@/components/proveedores/comparadorCard';
import { ProveedorCard } from '@/components/proveedores/proveedorCard';

export default function ProveedoresPage() {

  return (
    <div>
      <h1 className="font-bold text-3xl text-accent">Proveedores</h1>
      <p className="text-gray-600 text-xs mt-2">
        Gestión de relaciones y desempeño de proveedores para asegurar calidad y entrega oportuna
      </p>
      <div className="mt-6">
        <ComparadorCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
        <ProveedorCard nombre="Lacteos Express" razonSocial="Lacteos Express S.A." tipoProveedor="Proveedor A"telefono="123-456-7890" email="proveedor1@example.com" estado="activo" />
        <ProveedorCard nombre="Lacteos Express" razonSocial="Lacteos Express S.A." tipoProveedor="Proveedor A"telefono="123-456-7890" email="proveedor1@example.com" estado="inactivo" />
        <ProveedorCard nombre="Lacteos Express" razonSocial="Lacteos Express S.A." tipoProveedor="Proveedor A"telefono="123-456-7890" email="proveedor1@example.com" estado="activo" />
      </div>
      <AddProveedorButton />
    </div>
  );
}