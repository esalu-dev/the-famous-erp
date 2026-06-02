'use server';

import { config } from '@/lib/config';
import { revalidatePath } from 'next/cache';

export interface Proveedor {
  id?: string;
  nombre: string;
  razonSocial?: string | null;
  rfc?: string | null;
  tipo?: string | null;
  contactoNombre?: string | null;
  telefono?: string | null;
  correo?: string | null;
  direccion?: string | null;
  estado?: string;
}

export async function saveProveedorAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; data?: unknown }> {
  // Simular latencia de red
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const id = formData.get('id') as string | null;
  const nombre = formData.get('nombre') as string;

  if (!nombre) {
    return {
      success: false,
      message: 'El nombre comercial del proveedor es obligatorio.',
    };
  }

  const payload: any = { nombre };

  if (formData.has('razonSocial')) payload.razonSocial = formData.get('razonSocial') as string || null;
  if (formData.has('rfc')) payload.rfc = formData.get('rfc') as string || null;
  if (formData.has('tipo')) payload.tipo = formData.get('tipo') as string || null;
  if (formData.has('contactoNombre')) payload.contactoNombre = formData.get('contactoNombre') as string || null;
  if (formData.has('telefono')) payload.telefono = formData.get('telefono') as string || null;
  if (formData.has('correo')) payload.correo = formData.get('correo') as string || null;
  if (formData.has('direccion')) payload.direccion = formData.get('direccion') as string || null;
  if (formData.has('estado')) payload.estado = formData.get('estado') as string;

  try {
    const url = id
      ? `${config.services.inventory}/proveedores/${id}`
      : `${config.services.inventory}/proveedores`;
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
        message: errorData.message || `Error al ${id ? 'actualizar' : 'registrar'} el proveedor.`,
      };
    }

    const data = await res.json();
    
    revalidatePath('/app/proveedores');

    return {
      success: true,
      message: `Proveedor "${nombre}" ${id ? 'actualizado' : 'registrado'} exitosamente.`,
      data,
    };
  } catch (error) {
    console.error('Error saving proveedor:', error);
    return {
      success: false,
      message: `Error al conectar con el servidor para ${id ? 'actualizar' : 'registrar'} el proveedor.`,
    };
  }
}

export async function deleteProveedorAction(
  id: string,
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const res = await fetch(`${config.services.inventory}/proveedores/${id}`, {
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
        message: errorData.message || 'No se pudo eliminar el proveedor.',
      };
    }
  } catch (error) {
    console.error('Error deleting proveedor:', error);
    return {
      success: false,
      message: 'Error al intentar eliminar el proveedor.',
    };
  }

  revalidatePath('/app/proveedores');

  return {
    success: true,
    message: 'Proveedor eliminado correctamente.',
  };
}

export async function getProveedoresAction(): Promise<{ success: boolean; data: Proveedor[] }> {
  try {
    const res = await fetch(`${config.services.inventory}/proveedores`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      throw new Error('Error al obtener proveedores de la API');
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching proveedores:', error);
    return { success: false, data: [] };
  }
}
