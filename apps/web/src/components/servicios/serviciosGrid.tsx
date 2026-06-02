'use client';

import { useState } from 'react';
import { Plus } from '@gravity-ui/icons';
import { Button, toast } from '@heroui/react';
import { ServiciosCard } from './serviciosCard';
import { TotalCard } from './totalCard';
import { ServiciosForm } from './serviciosForm';
import { type Servicio, renewServicioPagoAction } from '@/actions/servicios.actions';

interface ServiciosGridProps {
  servicios: Servicio[];
}

export function ServiciosGrid({ servicios }: ServiciosGridProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [servicioAEditar, setServicioAEditar] = useState<Servicio | null>(null);

  const handleEdit = (servicio: Servicio) => {
    setServicioAEditar(servicio);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setServicioAEditar(null);
    setIsOpen(true);
  };

  const [renewingId, setRenewingId] = useState<string | null>(null);

  const handleRenew = async (id: string) => {
    setRenewingId(id);
    try {
      const response = await renewServicioPagoAction(id);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.danger(response.message);
      }
    } catch (err: any) {
      toast.danger(err.message || 'Error al registrar el pago');
    } finally {
      setRenewingId(null);
    }
  };

  const totalCosto = servicios
    .filter((s) => s.activo)
    .reduce((acc, s) => {
      const costo = Number(s.costo);
      switch (s.periodicidad) {
        case 'Diario':
          return acc + costo * 30;
        case 'Cada3Dias':
          return acc + costo * 10;
        case 'Semanal':
          return acc + (costo * 52) / 12; // 4.33 semanas por mes
        case 'Mensual':
          return acc + costo;
        case 'Bimestral':
          return acc + costo / 2;
        case 'Anual':
          return acc + costo / 12;
        default:
          return acc + costo;
      }
    }, 0);

  const totalCostoRedondeado = parseFloat(totalCosto.toFixed(2));

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const gastosDelMes = servicios
    .filter((s) => {
      if (!s.activo) return false;
      const date = new Date(s.proximoPago);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((acc, s) => acc + Number(s.costo), 0);

  const gastosDelMesRedondeado = parseFloat(gastosDelMes.toFixed(2));

  // Helper to determine service status based on proximoPago date
  const getEstado = (proximoPago: string | Date): 'Vigente' | 'Vencido' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(proximoPago);
    date.setHours(0, 0, 0, 0);
    return date >= today ? 'Vigente' : 'Vencido';
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <TotalCard title="Costo mensual proyectado (Overhead)" total={totalCostoRedondeado} />
        <TotalCard title="Gastos a pagar este mes en curso" total={gastosDelMesRedondeado} />
      </div>

      {servicios.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 mt-6 bg-content1 rounded-2xl border border-border">
          <p className="text-gray-500 text-sm">No hay servicios registrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
          {servicios.map((s) => (
            <ServiciosCard
              key={s.id}
              servicio={s.nombre}
              periodicidad={s.periodicidad}
              estado={s.activo ? getEstado(s.proximoPago) : 'Vencido'}
              costo={Number(s.costo)}
              proximoPago={new Date(s.proximoPago)}
              autorenovable={s.autorenovable}
              notas={s.notas || ''}
              onEdit={() => handleEdit(s)}
              onRenew={() => s.id && handleRenew(s.id)}
              isRenewing={renewingId === s.id}
            />
          ))}
        </div>
      )}

      <Button
        isIconOnly
        size="lg"
        className="fixed right-6 bottom-6 z-50 bg-primary text-primary-foreground shadow-xl hover:scale-105 transition-all"
        onPress={handleAdd}
      >
        <Plus className="size-6" />
      </Button>

      {isOpen && (
        <ServiciosForm
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          servicioAEditar={servicioAEditar}
        />
      )}
    </>
  );
}
