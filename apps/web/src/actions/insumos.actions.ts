'use server';

import { config } from '@/lib/config';

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

  console.log('Datos recibidos en el servidor:', Object.fromEntries(formData.entries()));
  formData.delete('foto');
  formData.delete('categoria');
  // TODO: Eliminar esta línea cuando se implemente la gestión de proveedores
  formData.delete('proveedor');
  try {
    const res = await fetch(`${config.services.inventory}/insumos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
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

  return {
    success: true,
    message: `Insumo guardado correctamente`,
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
