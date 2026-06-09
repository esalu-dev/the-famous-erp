'use server';

import { config } from '@/lib/config';
import { revalidatePath } from 'next/cache';

export interface RecetaItem {
  insumoId: string;
  cantidad: number;
  insumo?: {
    nombre: string;
    unidadMedida: string;
    precioActual: number;
  };
}

export interface Producto {
  id?: string;
  nombre: string;
  categoria: string;
  precioVenta: number;
  imagenUrl?: string | null;
  activo: boolean;
  receta?: RecetaItem[];
}

export async function saveProductoAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; uploadUrl?: string }> {
  // Simular latencia de red para demostrar el spinner de carga
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const id = formData.get('id') as string | null;
  const nombre = formData.get('nombre') as string;
  const categoria = formData.get('categoria') as string;
  const precioVentaRaw = formData.get('precioVenta');
  const activoRaw = formData.get('activo');
  const imagenFileName = formData.get('foto') as string | null;
  const recetaRaw = formData.get('receta') as string | null; // JSON string

  if (!nombre || !categoria || !precioVentaRaw) {
    return {
      success: false,
      message: 'Todos los campos obligatorios deben ser completados.',
    };
  }

  const precioVenta = Number(precioVentaRaw);
  if (isNaN(precioVenta) || precioVenta < 0) {
    return {
      success: false,
      message: 'El precio de venta debe ser un número válido mayor o igual a 0.',
    };
  }

  const activo = activoRaw !== 'false';

  let receta: { insumoId: string; cantidad: number }[] = [];
  if (recetaRaw) {
    try {
      receta = JSON.parse(recetaRaw);
    } catch (e) {
      console.error('Error parsing recipe JSON:', e);
    }
  }

  const payload = {
    nombre,
    categoria,
    precioVenta,
    activo,
    imagenFileName: imagenFileName || undefined,
    receta,
  };

  let fileUploadUrl: string = '';

  try {
    const url = id
      ? `${config.services.inventory}/productos/${id}`
      : `${config.services.inventory}/productos`;
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
        message: errorData.message || `Error al ${id ? 'actualizar' : 'guardar'} el producto`,
      };
    }
    const responseData = await res.json();
    fileUploadUrl = responseData.uploadUrl;
  } catch (error) {
    console.error('Error saving producto:', error);
    return {
      success: false,
      message: `Error al ${id ? 'actualizar' : 'guardar'} el producto`,
    };
  }

  revalidatePath('/app/productos');

  return {
    success: true,
    message: `Producto "${nombre}" ${id ? 'actualizado' : 'guardado'} correctamente`,
    uploadUrl: fileUploadUrl,
  };
}

export async function deleteProductoAction(
  id: string,
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    const res = await fetch(`${config.services.inventory}/productos/${id}`, {
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
        message: errorData.message || 'No se pudo eliminar el producto',
      };
    }
  } catch (error) {
    console.error('Error deleting producto:', error);
    return {
      success: false,
      message: 'Error al intentar eliminar el producto',
    };
  }

  revalidatePath('/app/productos');

  return {
    success: true,
    message: 'Producto desactivado correctamente',
  };
}

export async function getProductosAction(filters?: {
  categoria?: string;
  activo?: boolean;
  incluirReceta?: boolean;
}): Promise<{ success: boolean; data: Producto[] }> {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.categoria) queryParams.append('categoria', filters.categoria);
    if (filters?.activo !== undefined) queryParams.append('activo', String(filters.activo));
    if (filters?.incluirReceta !== undefined)
      queryParams.append('incluirReceta', String(filters.incluirReceta));

    const queryString = queryParams.toString();
    const url = `${config.services.inventory}/productos${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching productos:', error);
    return { success: false, data: [] };
  }
}
