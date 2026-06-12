'use server';

import { config } from '@/lib/config';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export interface VentaRegistro {
  id?: string;
  productoId: string;
  cantidad: number;
  procesado: boolean;
  producto?: {
    nombre: string;
    precioVenta: number;
    categoria: string;
    imagenUrl?: string | null;
  };
}

export async function getCierreStatusAction(
  fecha: string,
): Promise<{ success: boolean; status: 'NO_REGISTRADO' | 'PENDIENTE' | 'PROCESADO'; count: number }> {
  try {
    const res = await fetch(`${config.services.inventory}/cierre/status?fecha=${fecha}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Error al obtener estado del cierre');
    }

    const data = await res.json();
    return { success: true, status: data.status, count: data.count };
  } catch (error) {
    console.error('Error in getCierreStatusAction:', error);
    return { success: false, status: 'NO_REGISTRADO', count: 0 };
  }
}

export async function getVentasDiaAction(
  fecha: string,
): Promise<{ success: boolean; data: VentaRegistro[] }> {
  try {
    const res = await fetch(`${config.services.inventory}/cierre/ventas?fecha=${fecha}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Error al obtener las ventas del día');
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error in getVentasDiaAction:', error);
    return { success: false, data: [] };
  }
}

export async function saveVentasDiaAction(
  fecha: string,
  ventas: { productoId: string; cantidad: number }[],
): Promise<{ success: boolean; message: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: 'Usuario no autenticado.' };
  }

  try {
    const res = await fetch(`${config.services.inventory}/cierre/ventas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha,
        registradoPor: session.id,
        ventas,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, message: err.message || 'Error al guardar las ventas.' };
    }

    revalidatePath('/app/cierre');
    return { success: true, message: 'Ventas guardadas correctamente.' };
  } catch (error) {
    console.error('Error in saveVentasDiaAction:', error);
    return { success: false, message: 'Error al conectar con el servidor.' };
  }
}

export interface CierreResumen {
  ingresosTotales: number;
  costoInsumosTotales: number;
  gananciaNeto: number;
  margenNeto: number;
}

export async function procesarCierreAction(
  fecha: string,
): Promise<{ success: boolean; message: string; resumen?: CierreResumen; warnings?: string[] }> {
  try {
    const res = await fetch(`${config.services.inventory}/cierre/procesar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fecha }),
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, message: err.message || 'Error al procesar el cierre.' };
    }

    const data = await res.json();
    revalidatePath('/app/cierre');
    return {
      success: true,
      message: 'Cierre procesado e inventario actualizado con éxito.',
      resumen: data.resumen,
      warnings: data.warnings,
    };
  } catch (error) {
    console.error('Error in procesarCierreAction:', error);
    return { success: false, message: 'Error al conectar con el servidor para procesar cierre.' };
  }
}

export interface VentaHistorica {
  id: string;
  fecha: string;
  productoId: string;
  cantidad: number;
  procesado: boolean;
  producto: {
    id: string;
    nombre: string;
    categoria: string;
    precioVenta: number;
    receta?: {
      id: string;
      cantidad: number;
      insumo: {
        id: string;
        nombre: string;
        precioActual: number;
      };
    }[];
  };
}

export async function getHistoricoVentasAction(): Promise<{ success: boolean; data: VentaHistorica[] }> {
  try {
    const res = await fetch(`${config.services.inventory}/cierre/historico`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Error al obtener el histórico de ventas');
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error in getHistoricoVentasAction:', error);
    return { success: false, data: [] };
  }
}
