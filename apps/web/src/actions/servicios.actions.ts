'use server';

export interface Servicio {
  id?: string;
  nombre: string;
  costo: number;
  periodicidad: string;
  proximoPago: string | Date;
  notas?: string | null;
  activo: boolean;
}

export async function saveServicioAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; data?: unknown }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const nombre = formData.get('nombre');

  if (!nombre) {
    throw new Error('El nombre del servicio es obligatorio');
  }

  return {
    success: true,
    message: `Servicio "${nombre}" registrado exitosamente.`,
  };
}
