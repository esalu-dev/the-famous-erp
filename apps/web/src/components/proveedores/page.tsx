import { AddProveedorButton } from '@/components/proveedores/AddProveedorButton';

export default function ProveedoresPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-full">
      <h1 className="font-bold text-3xl text-accent">Proveedores</h1>

      <div className="mt-6">
        <div className="flex items-center justify-center border-2 border-dashed border-border rounded-xl h-64 bg-surface-secondary">
          <p className="text-muted"> tabla de proveedores.</p>
        </div>
      </div>

      {/* boton + */}
      <AddProveedorButton />
    </div>
  );
}
