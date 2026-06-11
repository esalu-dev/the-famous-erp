'use server';

import { config } from '@/lib/config';
import { revalidatePath } from 'next/cache';

export interface Servicio {
  id?: string;
  nombre: string;
  costo: number;
  periodicidad: string;
  proximoPago: string | Date;
  autorenovable: boolean;
  notas?: string | null;
  activo: boolean;
}

export async function getServiciosAction(): Promise<{ success: boolean; data: Servicio[] }> {
  try {
    const res = await fetch(`${config.services.inventory}/servicios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error fetching servicios from API:', errorData);
      return { success: false, data: [] };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching servicios:', error);
    return { success: false, data: [] };
  }
}

export async function saveServicioAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; data?: unknown }> {
  // Simular latencia de red para demostrar el spinner de carga
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const id = formData.get('id') as string | null;
  const nombre = formData.get('nombre') as string;
  const costoRaw = formData.get('costo');
  const periodicidad = formData.get('periodicidad') as string;
  const proximoPago = formData.get('proximoPago') as string;
  const notas = formData.get('notas') as string;
  const activo = formData.get('activo') === 'true';
  const autorenovable = formData.get('autorenovable') === 'true';

  if (!nombre || !costoRaw || !periodicidad || !proximoPago) {
    throw new Error('Todos los campos obligatorios deben ser completados.');
  }

  const costo = Number(costoRaw);
  if (isNaN(costo)) {
    throw new Error('El costo del servicio debe ser numérico.');
  }

  const payload = {
    nombre,
    costo,
    periodicidad,
    proximoPago,
    autorenovable,
    notas: notas || null,
    activo,
  };

  try {
    const url = id
      ? `${config.services.inventory}/servicios/${id}`
      : `${config.services.inventory}/servicios`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error response from API:', errorData);
      throw new Error(errorData.message || `Error al ${id ? 'actualizar' : 'guardar'} el servicio`);
    }

    const data = await res.json();
    revalidatePath('/app/servicios');

    return {
      success: true,
      message: `Servicio "${nombre}" ${id ? 'actualizado' : 'registrado'} exitosamente.`,
      data,
    };
  } catch (error: unknown) {
    console.error('Error saving servicio:', error);
    const message =
      error instanceof Error
        ? error.message
        : `Error al ${id ? 'actualizar' : 'guardar'} el servicio`;
    throw new Error(message);
  }
}

export async function deleteServicioAction(
  id: string,
): Promise<{ success: boolean; message: string }> {
  // Simular latencia de red para demostrar el spinner de carga
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    const res = await fetch(`${config.services.inventory}/servicios/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error response from API:', errorData);
      return {
        success: false,
        message: errorData.message || 'No se pudo eliminar el servicio',
      };
    }
  } catch (error) {
    console.error('Error deleting servicio:', error);
    return {
      success: false,
      message: 'Error al intentar eliminar el servicio',
    };
  }

  revalidatePath('/app/servicios');

  return {
    success: true,
    message: 'Servicio eliminado correctamente',
  };
}

export async function renewServicioPagoAction(
  id: string,
): Promise<{ success: boolean; message: string }> {
  // Simular latencia de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    // 1. Obtener los detalles actuales del servicio
    const resGet = await fetch(`${config.services.inventory}/servicios/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!resGet.ok) {
      throw new Error('No se pudieron obtener los detalles del servicio');
    }

    const servicio = await resGet.json();

    // 2. Calcular la fecha del próximo pago sumando la periodicidad
    const currentDate = new Date(servicio.proximoPago);
    const nextDate = new Date(currentDate);

    switch (servicio.periodicidad) {
      case 'Diario':
        nextDate.setDate(currentDate.getDate() + 1);
        break;
      case 'Cada3Dias':
        nextDate.setDate(currentDate.getDate() + 3);
        break;
      case 'Semanal':
        nextDate.setDate(currentDate.getDate() + 7);
        break;
      case 'Mensual':
        nextDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'Bimestral':
        nextDate.setMonth(currentDate.getMonth() + 2);
        break;
      case 'Anual':
        nextDate.setFullYear(currentDate.getFullYear() + 1);
        break;
      default:
        nextDate.setMonth(currentDate.getMonth() + 1);
    }

    // 3. Enviar el objeto completo actualizado al backend para pasar las validaciones del controlador
    const payload = {
      nombre: servicio.nombre,
      costo: Number(servicio.costo),
      periodicidad: servicio.periodicidad,
      proximoPago: nextDate.toISOString().split('T')[0],
      autorenovable: servicio.autorenovable,
      notas: servicio.notas,
      activo: servicio.activo,
    };

    const resPut = await fetch(`${config.services.inventory}/servicios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!resPut.ok) {
      const errorData = await resPut.json();
      throw new Error(errorData.message || 'Error al registrar el pago del servicio');
    }

    revalidatePath('/app/servicios');

    return {
      success: true,
      message: `Pago registrado correctamente. Próxima fecha: ${nextDate.toLocaleDateString()}`,
    };
  } catch (error: unknown) {
    console.error('Error renewing servicio pago:', error);
    const message =
      error instanceof Error ? error.message : 'Error al registrar el pago del servicio';
    return {
      success: false,
      message,
    };
  }
}
