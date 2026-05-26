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

  const nombre = formData.get('nombre');

  if (!nombre) {
    throw new Error('El nombre del insumo es obligatorio');
  }

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
