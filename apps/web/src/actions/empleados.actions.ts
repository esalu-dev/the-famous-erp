'use server';

import { config } from '@/lib/config';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export interface Empleado {
  id?: string;
  nombre: string;
  correo: string;
  password?: string;
  rol: string;
  activo: boolean;
}

export async function saveEmpleadoAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; data?: unknown }> {
  // Simular latencia de red
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const id = formData.get('id') as string | null;

  if (id) {
    const session = await getSession();
    if (session && id === session.id) {
      return {
        success: false,
        message: 'No puedes editar tu propio usuario activo.',
      };
    }
  }

  const nombre = formData.get('nombre') as string;
  const correo = formData.get('correo') as string;
  const password = formData.get('password') as string | null;
  let rol = formData.get('rol') as string;
  const activo = formData.get('activo') === 'true';

  if (!nombre) {
    return {
      success: false,
      message: 'El nombre del empleado es obligatorio.',
    };
  }

  if (!correo) {
    return {
      success: false,
      message: 'El correo electrónico del empleado es obligatorio.',
    };
  }

  // Normalizar el rol para que coincida con el enum de la base de datos (Admin / Operador)
  if (rol === 'admin') rol = 'Admin';
  if (rol === 'operador') rol = 'Operador';

  const payload: Partial<Empleado> & { password?: string } = {
    nombre,
    correo,
    rol,
    activo,
  };

  // Solo enviar la contraseña si se está creando, o si se especificó una nueva al editar
  if (password) {
    payload.password = password;
  }

  try {
    const url = id
      ? `${config.services.auth}/auth/usuarios/${id}`
      : `${config.services.auth}/auth/usuarios`;
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
      console.error('Error response from auth-service API:', errorData);
      return {
        success: false,
        message: errorData.message || `Error al ${id ? 'actualizar' : 'registrar'} el empleado.`,
      };
    }

    const data = await res.json();

    revalidatePath('/app/empleados');

    return {
      success: true,
      message: `Empleado "${nombre}" ${id ? 'actualizado' : 'registrado'} exitosamente.`,
      data,
    };
  } catch (error) {
    console.error('Error saving empleado:', error);
    return {
      success: false,
      message: `Error al conectar con el servidor para ${id ? 'actualizar' : 'registrar'} el empleado.`,
    };
  }
}

export async function deleteEmpleadoAction(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const session = await getSession();
  if (session && id === session.id) {
    return {
      success: false,
      message: 'No puedes eliminar tu propio usuario activo.',
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const res = await fetch(`${config.services.auth}/auth/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error response from auth-service API:', errorData);
      return {
        success: false,
        message: errorData.message || 'No se pudo eliminar el empleado.',
      };
    }
  } catch (error) {
    console.error('Error deleting empleado:', error);
    return {
      success: false,
      message: 'Error al intentar eliminar el empleado.',
    };
  }

  revalidatePath('/app/empleados');

  return {
    success: true,
    message: 'Empleado eliminado correctamente.',
  };
}

export async function getEmpleadosAction(): Promise<{ success: boolean; data: Empleado[] }> {
  try {
    const res = await fetch(`${config.services.auth}/auth/usuarios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error('Error al obtener empleados de la API');
    }

    const rawData = await res.json();
    
    // Normalizar roles para que el frontend los entienda si es necesario (ej. pasarlos a minúsculas)
    const data = rawData.map((emp: any) => ({
      ...emp,
      rol: emp.rol ? emp.rol.toLowerCase() : 'operador',
    }));

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching empleados:', error);
    return { success: false, data: [] };
  }
}
