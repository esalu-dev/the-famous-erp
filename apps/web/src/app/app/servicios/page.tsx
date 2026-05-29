import { ServiciosGrid } from '@/components/servicios/serviciosGrid';

export default function ServiciosPage() {
  return (
    <>
      <div>
        <h1 className="font-bold text-3xl text-accent">Servicios</h1>
        <p className="text-gray-600 text-xs mt-2">
          Gestión de servicios para optimizar operaciones y mejorar la eficiencia en la entrega de
          valor
        </p>
      </div>
      <ServiciosGrid />
    </>
  );
}
