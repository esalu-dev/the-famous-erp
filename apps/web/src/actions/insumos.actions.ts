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
  proveedorId?: string;
  imagenUrl?: string | null;
}

export async function saveInsumoAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; uploadUrl?: string }> {
  // Simular latencia de red para demostrar el spinner de carga
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const id = formData.get('id') as string | null;
  const nombre = formData.get('nombre') as string;
  const tipo = formData.get('tipo') as string;
  const unidadMedida = formData.get('unidadMedida') as string;
  const cantidadActualRaw = formData.get('cantidadActual');
  const cantidadMinimaRaw = formData.get('cantidadMinima');
  const precioActualRaw = formData.get('precioActual');
  const imagenFileName = formData.get('foto') as string | null;
  const proveedorId = formData.get('proveedorId') as string | null;

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
    imagenFileName, // Include the file name in the payload
    proveedorId: proveedorId || undefined,
  };

  let fileUploadUrl: string;

  try {
    const url = id
      ? `${config.services.inventory}/insumos/${id}`
      : `${config.services.inventory}/insumos`;
    const method = id ? 'PATCH' : 'POST';

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
      return {
        success: false,
        message: errorData.message || `Error al ${id ? 'actualizar' : 'guardar'} el insumo`,
      };
    }
    const responseData = await res.json();
    fileUploadUrl = responseData.uploadUrl; // Obtener la URL de subida del insumo creado/actualizado
  } catch (error) {
    console.error('Error saving insumo:', error);
    return {
      success: false,
      message: `Error al ${id ? 'actualizar' : 'guardar'} el insumo`,
    };
  }

  revalidatePath('/app/insumos');

  return {
    success: true,
    message: `Insumo "${nombre}" ${id ? 'actualizado' : 'guardado'} correctamente`,
    uploadUrl: fileUploadUrl,
  };
}

export async function deleteInsumoAction(
  id: string,
): Promise<{ success: boolean; message: string }> {
  // Simular latencia de red para demostrar el spinner de carga
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const res = await fetch(`${config.services.inventory}/insumos/${id}`, {
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
        message: errorData.message || 'No se pudo eliminar el insumo',
      };
    }
  } catch (error) {
    console.error('Error deleting insumo:', error);
    return {
      success: false,
      message: 'Error al intentar eliminar el insumo',
    };
  }

  revalidatePath('/app/insumos');

  return {
    success: true,
    message: 'Insumo eliminado correctamente',
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

export async function resurtirInsumoAction(
  id: string,
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const cantidadRaw = formData.get('cantidad');
  const proveedorId = formData.get('proveedorId') as string;
  const precioUnitarioRaw = formData.get('precioUnitario');

  if (!cantidadRaw || !proveedorId) {
    return {
      success: false,
      message: 'La cantidad y el proveedor son obligatorios.',
    };
  }

  const cantidad = Number(cantidadRaw);
  const precioUnitario = precioUnitarioRaw ? Number(precioUnitarioRaw) : undefined;

  if (isNaN(cantidad) || (precioUnitario !== undefined && isNaN(precioUnitario))) {
    return {
      success: false,
      message: 'Los valores de cantidad y precio unitario deben ser numéricos.',
    };
  }

  try {
    const res = await fetch(`${config.services.inventory}/insumos/${id}/resurtir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cantidad,
        proveedorId,
        precioUnitario,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error response from API:', errorData);
      return {
        success: false,
        message: errorData.message || 'Error al registrar el reabastecimiento del insumo.',
      };
    }
  } catch (error) {
    console.error('Error in resurtirInsumoAction:', error);
    return {
      success: false,
      message: 'Error al intentar conectar con el servidor para reabastecer el insumo.',
    };
  }

  revalidatePath('/app/insumos');

  return {
    success: true,
    message: 'Reabastecimiento registrado correctamente.',
  };
}
