'use server';

import { config } from '@/lib/config';
import { revalidatePath } from 'next/cache';

export interface Insumo {
  id?: string;
  nombre: string;
  tipo: string;
  unidadMedida: string;
  cantidadActual: number;
  cantidadMinima: number;
  precioActual: number;
  categoria?: 'A' | 'B' | 'C';
  //proveedor?: string;
  imagenUrl?: string | null;
}

export async function saveInsumoAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; data?: unknown }> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const nombre = formData.get('nombre') as string;
  const tipo = formData.get('tipo') as string;
  const unidadMedida = formData.get('unidadMedida') as string;
  const cantidadActualRaw = formData.get('cantidadActual');
  const cantidadMinimaRaw = formData.get('cantidadMinima');
  const precioActualRaw = formData.get('precioActual');

  if (!nombre || !tipo || !unidadMedida) {
    return {
      success: false,
      message: 'Todos los campos obligatorios deben ser completados.',
    };
  }

  const cantidadActual = cantidadActualRaw ? Number(cantidadActualRaw) : 0;
  const cantidadMinima = cantidadMinimaRaw ? Number(cantidadMinimaRaw) : 0;
  const precioActual = precioActualRaw ? Number(precioActualRaw) : 0;

  if (isNaN(cantidadActual) || isNaN(cantidadMinima) || isNaN(precioActual)) {
    return {
      success: false,
      message: 'Los valores de cantidad y precio deben ser numéricos.',
    };
  }

  const payload = {
    nombre,
    tipo,
    unidadMedida,
    cantidadActual,
    cantidadMinima,
    precioActual,
    categoria: 'C', // Default category required by database
  };

  try {
    const res = await fetch(`${config.services.inventory}/insumos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error response from API:', errorData);
      return {
        success: false,
        message: errorData.message || 'Error al guardar el insumo',
      };
    }
  } catch (error) {
    console.error('Error saving insumo:', error);
    return {
      success: false,
      message: 'Error al guardar el insumo',
    };
  }

  revalidatePath('/app/insumos');

  return {
    success: true,
    message: `Insumo "${nombre}" guardado correctamente`,
  };
}

export async function getInsumosAction(): Promise<{ success: boolean; data: Insumo[] }> {
  try {
    const res = await fetch(`${config.services.inventory}/insumos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching insumos:', error);
    return { success: false, data: [] };
  }
}
