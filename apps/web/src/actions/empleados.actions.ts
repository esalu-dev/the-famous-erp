'use server';

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
  // Simulación de una llamada a una API
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const nombre = formData.get('nombre');

  if (!nombre) {
    throw new Error('El nombre del empleado es obligatorio');
  }

  return {
    success: true,
    message: `Empleado "${nombre}" registrado exitosamente.`,
  };
}
